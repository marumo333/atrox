# 導入済みプラグイン・スキル一覧

> Claude Codeが参照可能なプラグインとスキルの一覧。
> 作業に応じて適切なスキルを参照すること。

---

## プロジェクト固有スキル（.claude/skills/）

| 作業 | 読むスキル |
|------|-----------|
| エージェントループ・arc_state・agent_queue | .claude/skills/agent-loop/SKILL.md |
| DBスキーマ・Drizzle・Neon接続 | .claude/skills/drizzle-neon/SKILL.md |
| Stripe・tier管理・Webhook | .claude/skills/stripe-tier/SKILL.md |

---

## Claude Code プラグイン

| プラグイン | 用途 |
|-----------|------|
| vercel | Vercelデプロイ・環境変数・関数管理 |
| context7 | ライブラリ公式ドキュメントの即時参照 |
| frontend-design | 高品質フロントエンドUI生成 |
| security-guidance | セキュリティベストプラクティス |
| github | GitHub操作支援 |
| dev-tools | 開発ワークフロー支援 |
| frontend | React/Tailwindパターン |
| cloudflare | Cloudflare Workers連携（将来用） |
| i18n-expert | 国際化対応（将来用） |

---

## Trail of Bits セキュリティスキル（.claude/skills/trailofbits/）

コード変更・PRレビュー・依存パッケージ追加時に参照すること：

| スキル | 用途 |
|-------|------|
| differential-review | コード差分のセキュリティレビュー |
| insecure-defaults | 安全でないデフォルト設定の検出 |
| supply-chain-risk-auditor | npm依存パッケージのリスク評価 |
| static-analysis | CodeQL/Semgrepによる静的解析 |
| sharp-edges | エラーを起こしやすいAPI使用の検出 |
| variant-analysis | パターンベースの脆弱性検出 |
| property-based-testing | プロパティベーステストの導入 |
