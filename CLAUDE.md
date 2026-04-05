# CLAUDE.md — Vesper Black プロジェクト

> Claude Codeがこのコードベースで作業する際の指示書。
> プロダクトの全仕様はdocs/PRD.mdを先に読むこと。

---

## プロジェクト概要

Vesper BlackはAI連載小説プラットフォーム。AIキャラ（Vesper）が週1回Dark Romantasyエピソードを自動生成・公開する。読者はサブスクで早期読み・リクエスト・専用キャラ育成ができる。

**スタック：** Next.js 15 + Hono + Neon（PostgreSQL）+ Drizzle ORM + Stripe + Vercel Cron  
**モノレポ：** pnpm workspaces + Turborepo  
**大原則：** 個人開発。賢さより保守性を優先する。

---

## Planモード

コードを書く前に必ず以下の形式で計画を出力すること：

```
## 計画
- 変更内容と理由
- 触るファイル一覧
- 先に書くテスト
- リスク・前提
```

承認を受けてから実装に進む。小さな変更でもスキップしない。

---

## TDD制約

**必ずテストを先に書いてから実装する。**

1. 期待する動作を記述した失敗テストを書く
2. テストが通る最小限のコードを実装する
3. テストを維持しながらリファクタリング

テスト配置場所：
- `packages/agent/src/__tests__/` — エージェントロジック
- `packages/db/src/__tests__/` — DBクエリ
- `apps/api/src/__tests__/` — ルートハンドラー

テストフレームワークは **Vitest** のみ使用。Jestは使わない。

---

## コード制約

### 200行ルール

**1ファイル200行以内。** 上限に近づいたら：

1. 論理的な境界を特定する
2. 単一責任の新ファイルに切り出す
3. importを更新する

これはガイドラインではなくハードルール。

### 単一責任

1ファイル = 1つのこと。ファイル名でそれを表現する。

```
✅ prompt-builder.ts      — プロンプトを組み立てる
✅ comment-aggregator.ts  — weightベースでコメントを集計する
✅ arc-state-manager.ts   — arc_stateをDBに読み書きする
❌ agent.ts               — 何でもやる（禁止）
```

### 関数サイズ

関数は30行以内。積極的にヘルパーに切り出す。

### 型安全

TypeScript strictモードを使用。暗黙のanyは禁止。`unknown`を使って型を絞る。共有型は`packages/types/src/index.ts`に置く。

### エラーハンドリング

全ての非同期関数で明示的にエラーを処理する。サイレントに飲み込まない。

---

## 自己改善ループ

タスク完了後に必ず振り返りを出力する：

```
## 振り返り
- うまくいったこと
- 指示が不明瞭だった箇所
- CLAUDE.mdへの改善提案
```

---

## エージェントパッケージのルール（packages/agent/）

### プロンプト構築順序

この順序を守ること。変えない：

1. `persona_prompt`（VesperのDNA — 最高ウェイト）
2. `style_rules`（文体制約）
3. `arc_state.world_state`（現在のストーリーコンテキスト）
4. `arc_state.recurring_entities`（キャラ・地名）
5. `arc_state.style_drift`（Vesperの変化ログ）
6. `top_comments`（読者入力 — 最低ウェイト、最後に置く）
7. 生成指示（「次のエピソードを書け」）

### arc_state更新

生成後に4つのフィールドを全て更新する：

- `world_state` — このエピソードで確定した新事実・場所・伏線
- `recurring_entities` — 新たに登場したキャラ名・地名・アイテム
- `style_drift` — 意図的なトーン・ペースの変化
- `emotional_log` — コメントのセンチメントから読者反応を要約

episodeのinsertとarc_stateの更新は同一トランザクションで行う。

### エージェントキュー

- HTTPリクエストハンドラーから直接Claude APIを呼ばない
- 全ての生成は`agent_queue` → Cronピックアップ経由で行う
- 失敗時：`status = 'failed'`にしてログを残す。自動リトライしない
- リトライは管理者ダッシュボードから手動で行う

---

## APIルール（apps/api/）

### Tierガードのパターン

```ts
// ✅ このパターンを使う
app.get('/episodes/:id', auth(), tierGuard('pro'), async (c) => {
  // ハンドラー
})
```

### Webhook

Stripe webhookは署名検証を必ず行う。認証ミドルウェアは通さない。

---

## 環境変数

シークレットをハードコードしない。必ず起動時にバリデーションする：

```ts
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) throw new Error('ANTHROPIC_API_KEY が設定されていません')
```

必須変数：`DATABASE_URL` / `ANTHROPIC_API_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `AUTH_SECRET` / `CRON_SECRET`

---

## スキル参照ルール

UIコンポーネント・ページ・画面を実装する前に必ず以下を読むこと：

```bash
# Claude Codeのコンテキストに読み込む
cat /mnt/skills/public/frontend-design/SKILL.md
```

対象となる作業：
- ランディングページ
- エピソード読書UI
- キャラクタープロフィールページ
- 管理者ダッシュボード
- 認証画面（ログイン・登録）

---

## やってはいけないこと

- `any`型を使う（`unknown`を使って絞る）
- ルートハンドラーにビジネスロジックを書く（サービス関数に委譲する）
- フロントエンドコンポーネントから外部API（Claude・Stripe）を直接呼ぶ
- 1ファイル200行を超える
- 失敗したエージェントジョブを自動リトライする