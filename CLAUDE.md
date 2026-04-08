# CLAUDE.md — Atrox プロジェクト

> Claude Codeがこのコードベースで作業する際の指示書。
> 参照: `docs/PRD.md`（製品仕様）/ `docs/ROADMAP.md`（実装戦略）/ `docs/SKILLS.md`（スキル）

---

## プロジェクト概要

AtroxはAI連載小説プラットフォーム。AIキャラ（Vesper Black）が週1回Dark Romantasyエピソードを自動生成・公開する。読者はサブスクで早期読み・リクエスト・専用キャラ育成ができる。

**スタック：** Next.js 16 + Hono + Neon（PostgreSQL）+ Drizzle ORM + Lemon Squeezy + Vercel Cron  
**モノレポ：** pnpm workspaces + Turborepo  
**大原則：** 個人開発。賢さより保守性を優先する。

---

## スキル参照ルール

以下の作業前に対応するスキルを必ず読むこと：

| 作業 | 読むスキル |
|------|-----------|
| UIコンポーネント・ページ実装 | /mnt/skills/public/frontend-design/SKILL.md |
| エージェントループ・arc_state・agent_queue | .claude/skills/agent-loop/SKILL.md |
| DBスキーマ・Drizzle・Neon接続 | .claude/skills/drizzle-neon/SKILL.md |
| Lemon Squeezy・tier管理・Webhook | .claude/skills/lemon-tier/SKILL.md |

プラグイン・セキュリティスキルの全一覧は `docs/SKILLS.md` を参照。

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
- `apps/web/src/__tests__/` — フロントエンドユーティリティ・設定

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

### Lint & Format

- **ESLint**: ルートの`eslint.config.mjs`で共有設定。`@typescript-eslint/no-explicit-any: error`
- **Prettier**: `.prettierrc`で統一フォーマット（セミコロンなし、シングルクォート）
- `pnpm lint` — 全パッケージのESLintを実行
- `pnpm format` — Prettierで全ファイルをフォーマット
- `pnpm format:check` — フォーマット違反の検出（CIで使用）
- コミット前に`pnpm lint && pnpm format:check`が通ることを確認する

### CI/CD

GitHub Actions（`.github/workflows/ci.yml`）で以下を自動実行：

1. **Lint**: ESLint + Prettier check（push / PR時）
2. **Test**: Vitest全パッケージ（push / PR時）
3. **Build**: Next.js + TypeScript ビルド（Lint・Test通過後）

Vercelはmainブランチへのpushで本番デプロイ、PRでプレビューデプロイを自動実行。

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

詳細実装は `.claude/skills/agent-loop/SKILL.md` を参照。

### arc_state更新

生成後に4つのフィールドを全て更新する。episodeのinsertとarc_stateの更新は同一トランザクションで行う。

### エージェントキュー

- HTTPリクエストハンドラーから直接Claude APIを呼ばない
- 全ての生成は`agent_queue` → Cronピックアップ経由で行う
- 失敗時：`status = 'failed'`にしてログを残す。自動リトライしない

---

## APIルール（apps/api/）

### Tierガード

`auth()` → `tierGuard('pro')` → ハンドラーの順でミドルウェアを適用する。

### Webhook

Lemon Squeezy webhookはHMAC SHA256で署名検証を必ず行う。認証ミドルウェアは通さない。詳細は `.claude/skills/lemon-tier/SKILL.md` を参照。

---

## 環境変数

シークレットをハードコードしない。必ず起動時にバリデーションする。必須変数：
- `DATABASE_URL` — Neon接続文字列
- `ANTHROPIC_API_KEY` — Claude API
- `LEMONSQUEEZY_API_KEY` — Lemon Squeezy API
- `LEMONSQUEEZY_WEBHOOK_SECRET` — Webhook署名シークレット
- `LEMONSQUEEZY_STORE_ID` — ストアID
- `LEMONSQUEEZY_VARIANT_PRO` — ProプランのVariant ID
- `LEMONSQUEEZY_VARIANT_PREMIUM` — PremiumプランのVariant ID
- `AUTH_SECRET` — Auth.js secret
- `CRON_SECRET` — Vercel cron認証ヘッダー
- `NEXT_PUBLIC_URL` — 本番URL

---

## やってはいけないこと

- `any`型を使う（`unknown`を使って絞る）
- ルートハンドラーにビジネスロジックを書く（サービス関数に委譲する）
- フロントエンドコンポーネントから外部API（Claude・Stripe）を直接呼ぶ
- 1ファイル200行を超える
- 失敗したエージェントジョブを自動リトライする
- Lemon Squeezy webhookの署名検証をスキップする