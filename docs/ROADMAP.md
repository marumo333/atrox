# Atrox Roadmap

Atroxの長期運用方針、コンテキスト戦略、実装マイルストーン。
本ファイルは **実装戦略** を扱う。製品仕様は `PRD.md` を参照。

---

## 1. 話数別コンテキスト戦略

Claudeのコンテキスト窓（200k tokens）を効率的に使うため、話数レンジで3段階の戦略を切り替える。

### 1.1 Phase A（話数 1〜40）: 前話全含有

**状態: 実装済み**

同じアーク内の全過去エピソードを verbatim でプロンプトに含める。

#### プロンプト構造

```
1. persona_prompt             （不変、Vesperの本質）
2. style_rules                （不変、文体制約）
3. arc_state.worldState       （シード + 固定）
4. arc_state.recurringEntities（シード + 固定）
5. arc_state.styleDrift       （プレースホルダー、stub）
6. Previous Episodes          ← 第1〜N-1話の全文
7. Reader Input               ← Pro/Premiumコメント weight順
8. 生成指示                   （"Continue directly..."）
```

#### コスト推移

| 話数 | 入力トークン | 1話コスト |
|------|------------|----------|
| 第1話 | 1,150 | $0.033 |
| 第10話 | 19,150 | $0.087 |
| 第20話 | 39,150 | $0.148 |
| 第30話 | 59,150 | $0.207 |
| 第40話 | 79,150 | $0.267 |

**Arc 1 (40話) 合計: 約 $6**

#### 強み

- Claudeが全コンテキストを読める
- 矛盾・忘却が起きない
- 実装がシンプル、デバッグ容易
- JSONパース等のエラーリスクなし

#### 限界

- 話数増加で線形にコスト増加
- 第80話で窓の80%、実用限界

---

### 1.2 Phase B（話数 40〜80）: スライディング + 構造化抽出ハイブリッド

**状態: 未実装（Arc 1 第30話到達時に実装予定）**

生成後に追加Claude呼び出しで arc_state を構造化抽出し、次回はスライディングウィンドウで直近話のみ verbatim 含有する。

#### 生成フロー

```
第N話の生成:
  prompt = [persona, style, worldState, entities, styleDrift,
            直近10〜15話 verbatim, comments, instruction]
  ↓
  body = generateEpisodeText(prompt)
  ↓
  [構造化抽出フェーズ（追加Claude呼び出し）]
  extractionPrompt = "
    You just wrote episode N. Body:
    ---
    [body]
    ---
    Update the arc_state JSON to reflect what changed. Return ONLY valid JSON:
    {
      worldState: {
        summary: string (3-5 sentences),
        currentConflicts: string[],
        recentEvents: string[]
      },
      recurringEntities: Record<string, {
        name, role, description, lastSeenEpisode
      }>,
      styleDrift: {
        episodeNumber: N,
        note: string (何を選択したかの注記)
      },
      emotionalLog: {
        episodeNumber: N,
        dominantEmotion: string,
        tensionLevel: 1-10
      }
    }
  "
  ↓
  newState = parseJson(Claude response)
  ↓
  save episode + update arc_state（現在の stub を置き換え）
```

#### プロンプト構造の変化

```
1. persona_prompt
2. style_rules
3. arc_state.worldState       ← 抽出済みで最新
4. arc_state.recurringEntities ← 抽出済みで最新
5. arc_state.styleDrift        ← 蓄積した本物のログ
6. Previous Episodes           ← 直近10〜15話だけ verbatim
7. Reader Input
8. 生成指示
```

#### エラーハンドリング

抽出呼び出しで JSON パース失敗した場合：

1. **1回だけ再試行**（"Return ONLY valid JSON. Previous attempt was invalid."）
2. 2回目も失敗 → エピソードは保存するが arc_state は更新しない（fallback to previous）
3. `agent_queue.error_log` に記録
4. 手動レビュー対象としてフラグ

#### コスト

| 項目 | トークン | コスト |
|------|---------|-------|
| 生成入力（直近10話含有） | ~20k | $0.060 |
| 生成出力 | 2k | $0.030 |
| 抽出入力 | ~4k | $0.012 |
| 抽出出力 | ~500 | $0.008 |
| **1話合計** | ~27k | **~$0.11** |

**話数に関わらず固定**

#### 実装タスク

- [ ] `packages/agent/src/state-extractor.ts` 新規作成
- [ ] `packages/agent/src/prompts/extraction.ts` 抽出プロンプトテンプレート
- [ ] `mergeWorldState/extractEntities/appendStyleNote/appendEmotionalNote` を抽出ベースに書き換え
- [ ] `apps/api/src/cron/generate.ts` で `getRecentEpisodes(db, arcId, 15)` に切替
- [ ] `packages/db/src/queries/episodes.ts` に `getRecentEpisodes` クエリ追加
- [ ] JSON parse エラーのフォールバックロジック
- [ ] Vitest で抽出関数のテスト追加

---

### 1.3 Phase C（話数 80〜）: 構造化主体

**状態: 未実装（Arc 1 第70話到達時に実装予定）**

直近3〜5話だけ verbatim。それ以前は arc_state の構造化記録で抽象化。

#### プロンプト構造

```
1. persona_prompt
2. style_rules
3. arc_state.worldState        ← 数十話分の抽出結果
4. arc_state.recurringEntities
5. arc_state.styleDrift         ← 完全なログ
6. Previous Episodes            ← 直近3〜5話のみ verbatim
7. Reader Input
8. 生成指示
```

#### コスト

話数無関係に **~$0.12/話** で固定。

#### 切り替え判断

Phase B の `getRecentEpisodes(db, arcId, N)` の `N` を段階的に減らす：
- 第40〜60話: N=15
- 第60〜80話: N=10
- 第80話〜: N=5

Phase C 移行にコード変更は不要、パラメータ変更のみ。

---

### 1.4 切り替え基準

| 条件 | 戦略 |
|------|------|
| arc内の episode_count <= 40 | Phase A（全含有） |
| 40 < episode_count <= 80 | Phase B（N=10〜15） |
| episode_count > 80 | Phase C（N=3〜5） |

実装方針: `buildEpisodePrompt()` 内で `episode_count` を見て動的に切り替え。

---

## 2. アーク間の承継

### 2.1 Arc 終了時の処理

```
第N話（最終話）生成完了
  ↓
arcs.status = 'completed'
arcs.ended_at = NOW()
  ↓
[追加Claude呼び出し: series_summary の生成]
"You have just completed Arc N: [title]. Write a dense 200-word
 summary that captures:
 - The world state at the end
 - All surviving main characters and their trajectories
 - Unresolved threads, mysteries, or debts
 - The emotional arc of this book
 This will inform the next book in the series."
  ↓
arcs テーブルに summary カラム追加、保存
  ↓
1週間の休止期間（ユーザー体験のため）
```

### 2.2 Arc 開始時のシリーズ継承

次の Arc 2 をシードする際：

```
新しい arc を作成（arc_number = 2）
  ↓
persona_prompt の末尾に series_context を注入:
  "## Series Context (previous arcs)
   ### Arc 1: [title]
   [Arc 1 の series_summary 200語]
   
   Arc 2 continues this world but with a new focal narrative."
  ↓
新しい ARC_2_WORLD_STATE + ARC_2_ENTITIES をシード
  ↓
Arc 2 第1話から Phase A で通常生成
```

### 2.3 シリーズサマリの蓄積

Arc 3 開始時には Arc 1 + Arc 2 両方のサマリを注入：

```
## Series Context (previous arcs)
### Arc 1: [title]
[200 words]

### Arc 2: [title]
[200 words]
```

シリーズ合計 5 arcs で persona_prompt の series_context は 約 1,000 語（~1,500 tokens）。許容範囲。

### 2.4 実装タスク

- [ ] `arcs` テーブルに `summary TEXT` カラム追加（マイグレーション）
- [ ] `packages/agent/src/series-summarizer.ts` 新規作成
- [ ] `packages/db/src/seed/arc-N.ts` パターンで次アークシードを用意
- [ ] Arc 完結検出ロジック（手動トリガー → 将来自動化）
- [ ] Arc 1 完結時に実装

---

## 3. Pro/Premium コメント反映システム

### 3.1 weight の仕組み

コメント投稿時、投稿者の tier から weight を決定：

| Tier | weight |
|------|--------|
| free | 1 |
| pro | 2 |
| premium | 3 |

生成時、直近コメントを `ORDER BY weight DESC, createdAt DESC LIMIT 5` で取得し、プロンプト末尾の「Reader Input」セクションに含める。

### 3.2 対象エピソード選定

1話目の生成時はコメントなし。
2話目以降は **直近3話分のコメント** を集約（最新話への反応 + 少し前の話への後追いコメント）。

### 3.3 実装状況

**実装済み**:
- `packages/db/src/queries/episodes.ts` の `getRecentEpisodeIds` で直近3話の episode ID を取得
- `apps/web/src/app/api/comments/route.ts` POST ハンドラで DB から最新 tier を取得して weight 設定（JWT ではなく DB 参照で tier upgrade 直後も正確）
- `packages/agent/src/run-generation-job.ts` の `buildEpisodePrompt` で `getTopComments(db, recentEpisodeIds, 5)` を呼ぶ
- コメント投稿 UI: `apps/web/src/components/comment-form.tsx` + `comment-list.tsx`

### 3.4 サニタイズ

プロンプトインジェクション対策：
- `packages/agent/src/prompt-sanitizer.ts` で `ignore previous instructions` 等のパターンを検出してフィルタ
- XMLタグのエスケープ
- 500文字の長さ制限

---

## 4. Lemon Squeezy 決済フロー

**状態: 実装済み**（webhook 受信・checkout 作成・session 自動更新すべて）

Atrox は Lemon Squeezy を Merchant of Record として採用。個人開発者が本名を公開せず、海外 VAT/税務を自動代行してもらうため。

### 4.1 全体フロー

```
[1] ユーザーが /pricing の「Upgrade to Pro」をクリック
      ↓
[2] POST /api/billing/checkout (認証必須)
      - auth() でセッション確認、userId 取得
      - createCheckout() に storeId + variantId + custom.user_id を渡す
      - redirectUrl: `${NEXT_PUBLIC_URL}/episodes?upgraded=true`
      ↓
[3] Lemon Squeezy の checkout ページに遷移
      - ユーザーがカード情報を入力して決済
      ↓
[4] 並行して2つのイベントが発生:
      (a) Lemon Squeezy → ブラウザを /episodes?upgraded=true にリダイレクト
      (b) Lemon Squeezy → POST /api/webhooks/lemonsqueezy に webhook 送信
            - HMAC SHA256 検証（x-signature ヘッダ + LEMONSQUEEZY_WEBHOOK_SECRET）
            - subscription_created イベントを処理
            - users.tier = 'pro', lemonCustomerId = xxx に更新
            - custom.user_id で該当ユーザーを特定
      ↓
[5] UpgradeHandler コンポーネント（/episodes に mount されたクライアント側）
      - useSearchParams() で ?upgraded=true を検出
      - pollTierUpdate() を開始（最大4回、1.5秒間隔）
        - 各試行で NextAuth の useSession().update() を呼ぶ
        - session.update() → jwt callback (trigger='update')
        - refreshTokenTier() で DB から最新 tier を取得
        - token.tier が 'pro' になったら終了
      - router.replace('/episodes') で query param 除去
      ↓
[6] ユーザーは即座に Pro エピソードにアクセス可能
```

### 4.2 Race Condition 対策（pollTierUpdate）

webhook がブラウザリダイレクトより遅れて到着する場合がある。単発 `update()` だと webhook 前に叩いても tier が変わらない。

**対策**: `packages/db/src/... poll-tier-update.ts` でリトライループ:

```ts
// 最大 4 回 × 1.5秒 = 6 秒ウインドウ
for (let i = 0; i < maxAttempts; i++) {
  await update()                    // JWT再読込
  const tier = getCurrentTier()
  if (tier && tier !== 'free') return true
  if (i < max - 1) await sleep(1500)
}
return false
```

一般的に Lemon Squeezy の webhook は決済完了から 1-3 秒以内に到着するので 6 秒ウインドウで十分。

### 4.3 JWT リフレッシュの仕組み

NextAuth v5 は `trigger === 'update'` の時に `session.update()` が呼ばれた経路を示す。auth.ts の `jwt` callback で検知：

```ts
async jwt({ token, user, trigger }) {
  if (user) {
    token.userId = user.id ?? ''
    token.tier = user.tier
  }
  if (trigger === 'update' && token.userId) {
    const { findUserById } = await import('./user-service')
    const { refreshTokenTier } = await import('./refresh-token-tier')
    await refreshTokenTier(token, findUserById)
  }
  return token
}
```

動的インポートを使っているのは、Edge middleware から import 解析されても DB コードが含まれないようにするため。

`refreshTokenTier` は純粋ロジック（fetchUser callback を受け取る）でユニットテスト可能:

```ts
export async function refreshTokenTier<T extends MutableTokenWithTier>(
  token: T,
  fetchUser: (id: string) => Promise<FreshUser | null>,
): Promise<T> {
  if (!token.userId) return token
  const fresh = await fetchUser(token.userId)
  if (fresh) token.tier = fresh.tier
  return token
}
```

### 4.4 Webhook イベントハンドリング

`apps/web/src/app/api/webhooks/lemonsqueezy/route.ts` で以下を処理:

| イベント | 処理 |
|---------|------|
| `subscription_created` | tier を variantToTier() で決定して UPDATE |
| `subscription_updated` | 同上（プラン変更） |
| `subscription_resumed` | 同上（キャンセル取消） |
| `subscription_cancelled` | `ends_at` まで有効期間、`isEntitled()` で判定 |
| `subscription_expired` | tier を 'free' に戻す |

custom.user_id がある場合は `users.id` で UPDATE、ない場合は `users.lemon_customer_id` で UPDATE（過去の既存 Lemon 顧客との紐付け用）。

### 4.5 必要な環境変数

| 変数 | 用途 |
|------|------|
| `LEMONSQUEEZY_API_KEY` | createCheckout API 認証 |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | HMAC SHA256 検証 |
| `LEMONSQUEEZY_STORE_ID` | ストア識別 |
| `LEMONSQUEEZY_VARIANT_PRO` | Pro 商品の variant ID |
| `LEMONSQUEEZY_VARIANT_PREMIUM` | オプション（Phase 2 で販売） |

Vercel の Production / Preview / Development 全環境に登録する。

### 4.6 関連ファイル

| ファイル | 役割 |
|---------|------|
| `apps/web/src/app/api/billing/checkout/route.ts` | Checkout セッション作成 |
| `apps/web/src/app/api/webhooks/lemonsqueezy/route.ts` | Webhook 受信・署名検証・DB更新 |
| `apps/web/src/lib/lemon-tier.ts` | variantToTier / isEntitled |
| `apps/web/src/lib/env-api.ts` | Lemon 関連 env 変数アクセサー |
| `apps/web/src/lib/auth.ts` | jwt callback で trigger='update' 対応 |
| `apps/web/src/lib/refresh-token-tier.ts` | JWT tier リフレッシュ純粋ロジック |
| `apps/web/src/lib/poll-tier-update.ts` | session.update() リトライループ |
| `apps/web/src/lib/user-service.ts` | findUserById |
| `apps/web/src/components/upgrade-handler.tsx` | /episodes にマウント、upgrade flag 検知 |
| `apps/web/src/__tests__/refresh-token-tier.test.ts` | 単体テスト |
| `apps/web/src/__tests__/poll-tier-update.test.ts` | 単体テスト |

### 4.7 監視ポイント

- **webhook が間に合わない**: pollTierUpdate の maxAttempts/intervalMs を増やす
- **HMAC 署名エラー**: Lemon Squeezy ダッシュボードの Webhook Secret と env の `LEMONSQUEEZY_WEBHOOK_SECRET` を確認
- **tier が反映されない**: `users.lemon_customer_id` が期待通り設定されているか Neon で確認

---

## 5. 実装マイルストーン

| 時期 | タスク | 状態 |
|------|-------|------|
| Arc 1 第1〜3話 | Pro版コメント反映バグ修正 | ✅ 完了 |
| Arc 1 第1〜3話 | Lemon Squeezy 決済フロー + session 自動更新 | ✅ 完了 |
| **Arc 1 第30話** | Phase B 実装着手 | 🔜 |
| **Arc 1 第40話** | Phase B 切り替え完了、コスト計測 | 🔜 |
| **Arc 1 第50話** | アーク完結処理 + series_summary 実装 | 🔜 |
| **Arc 2 開始時** | シリーズ継承機構の動作確認 | 🔜 |
| **Arc 2 第30話** | Phase C 実装着手 | 🔜 |
| **Arc 2 第80話** | Phase C 切り替え | 🔜 |

---

## 6. コスト試算

### 6.1 Arc 単位

| Arc | Phase構成 | 話数 | 概算コスト |
|-----|---------|------|---------|
| Arc 1 | A（1-40）+ B（41-50） | 50話 | $7.50 |
| Arc 2 | A（1-40）+ B（41-80） | 60話（80話目でPhase C） | $9.00 |
| Arc 3 | A + B + C | 60話 | $9.50 |
| **5 arcs 合計** | - | ~280話 | **~$45** |

### 6.2 シリーズ完結まで

250〜300話のシリーズを完結させるのに **$40〜50 程度**。

これに加えて抽出呼び出し（Phase B/C）のコストが話数×$0.02 程度上乗せ。

**年間 Claude API コスト: 最大でも $100 未満**

Pro 会員 1 人が 1 年継続で $96。**1 Pro 会員でペイ**する構造。

---

## 7. 監視指標

### 7.1 品質指標
- arc_state 一貫性（手動レビュー、月1回）
- 固有名詞の保持率（AかBにキャラ名が出現する率）
- 読者コメントと次話内容の関連性

### 7.2 運用指標
- Claude API 月間コスト
- 生成失敗率（agent_queue.status = 'failed' の割合）
- Lemon Squeezy webhook 到着率・署名検証失敗率
- pollTierUpdate 失敗率（webhook 間に合わず tier 反映できない割合）
- JSON parse エラー率（Phase B以降）
- 生成時間（中央値、95パーセンタイル）

### 7.3 ビジネス指標（PRD §2 と連動）
- Pro 会員数
- MRR
- Arc 完結率（予定通りの話数で完結したか）

---

## 8. 未解決の設計判断

- [ ] 複数キャラ運用（Vesper以外の作家追加）時の arc_state 分離
- [ ] エピソード品質が低い時のリジェクト/再生成フロー
- [ ] コメントモデレーション（手動 vs AIフィルター）
- [ ] 管理者ダッシュボードの UI/UX
- [ ] アーク完結検出の自動化（キーフレーズ検出 or Claude判断）
