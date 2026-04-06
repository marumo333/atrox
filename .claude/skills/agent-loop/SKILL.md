---
name: agent-loop
description: Atroxのエージェント生成ループを実装するときに使う。arc_stateの読み書き、プロンプト組み立て、agent_queueの管理、Claude API呼び出しが含まれる作業では必ずこのスキルを参照すること。
---

# Atrox エージェントループ実装ガイド

## 絶対に守るルール

- Claude APIはHTTPリクエストハンドラーから**直接呼ばない**
- 全生成はagent_queue → Cronピックアップ経由
- arc_stateの更新とepisodesのinsertは**同一トランザクション**
- 失敗時は`status='failed'`にして止める。自動リトライしない

---

## プロンプト組み立て順序（変えない）

```ts
// packages/agent/src/prompt-builder.ts
export function buildPrompt(input: PromptInput): string {
  return [
    // 1. キャラDNA（最高ウェイト・必ず最初）
    input.character.persona_prompt,

    // 2. 文体制約
    input.character.style_rules,

    // 3. 現在のアークコンテキスト
    `## Current Arc State\n${JSON.stringify(input.arcState.world_state)}`,

    // 4. 登場人物・固有名詞DB
    `## Recurring Entities\n${JSON.stringify(input.arcState.recurring_entities)}`,

    // 5. 文体ドリフトログ
    `## Style Evolution\n${JSON.stringify(input.arcState.style_drift)}`,

    // 6. 読者反応（最低ウェイト・必ず最後）
    `## Reader Input This Week\n${input.topComments.map(c => c.body).join('\n')}`,

    // 7. 生成指示
    `Write episode ${input.episodeNumber} of the current arc. Do not summarize. Just write.`,
  ].join('\n\n---\n\n')
}
```

---

## arc_state更新パターン

```ts
// packages/agent/src/state-manager.ts
export async function updateArcState(
  db: DbClient,
  arcId: string,
  episodeBody: string,
  currentState: ArcState,
): Promise<void> {
  // 必ずトランザクション内で実行
  await db.transaction(async (tx) => {
    // 1. episodesに書き込む
    await tx.insert(episodes).values({
      arcId,
      episodeNumber: currentState.episode_count + 1,
      body: episodeBody,
      tier: 'pro',
      publishedAt: new Date(),
    })

    // 2. arc_stateを更新（4フィールド全て更新する）
    await tx
      .update(arcState)
      .set({
        episodeCount: currentState.episode_count + 1,
        worldState: mergeWorldState(currentState.world_state, episodeBody),
        recurringEntities: extractEntities(episodeBody, currentState.recurring_entities),
        styleDrift: appendStyleNote(currentState.style_drift, episodeBody),
        emotionalLog: appendEmotionalNote(currentState.emotional_log),
        updatedAt: new Date(),
      })
      .where(eq(arcState.arcId, arcId))
  })
}
```

---

## agent_queue管理パターン

```ts
// apps/api/src/cron/generate.ts
export async function runGenerationJob(db: DbClient): Promise<void> {
  // 1. pendingジョブを1件取得してrunningに更新（競合防止）
  const job = await db.transaction(async (tx) => {
    const [job] = await tx
      .select()
      .from(agentQueue)
      .where(eq(agentQueue.status, 'pending'))
      .limit(1)
      .for('update', { skipLocked: true }) // 同時実行防止

    if (!job) return null

    await tx
      .update(agentQueue)
      .set({ status: 'running' })
      .where(eq(agentQueue.id, job.id))

    return job
  })

  if (!job) return

  try {
    // 2. 生成実行
    const episode = await generateEpisode(db, job)

    // 3. 成功：doneに更新 + 翌週ジョブをキューに積む
    await db.transaction(async (tx) => {
      await tx.update(agentQueue)
        .set({ status: 'done' })
        .where(eq(agentQueue.id, job.id))

      await tx.insert(agentQueue).values({
        arcId: job.arcId,
        trigger: 'cron_weekly',
        status: 'pending',
        scheduledAt: nextMonday(),
      })
    })
  } catch (err) {
    // 4. 失敗：failedに更新して止める（自動リトライしない）
    await db.update(agentQueue)
      .set({ status: 'failed' })
      .where(eq(agentQueue.id, job.id))

    throw err
  }
}
```

---

## Claude API呼び出しパターン

```ts
// packages/agent/src/generator.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateEpisode(prompt: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  return content.text
}
```

---

## コメントweight集計パターン

```ts
// packages/agent/src/comment-aggregator.ts
// Free=1, Pro=2, Premium=3
export async function aggregateTopComments(
  db: DbClient,
  episodeIds: string[],
  limit = 5,
): Promise<Comment[]> {
  return db
    .select()
    .from(comments)
    .where(inArray(comments.episodeId, episodeIds))
    .orderBy(desc(comments.weight), desc(comments.createdAt))
    .limit(limit)
}
```