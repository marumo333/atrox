# PRD — Atrox: AI連載小説プラットフォーム

**バージョン:** 0.1.0  
**ステータス:** ドラフト  
**作成者:** Marumo（個人開発）  
**最終更新:** 2026-04-06

---

## 1. 概要

### 1.1 プロダクト概要

Atroxは、AIが動かす「作家キャラクター」が連載小説を書き続ける英語圏向けプラットフォーム。読者は「作品」ではなく「このキャラが書く次の話」を追う。連載を重ねるごとに文体・世界観・キャラクターが蓄積され、作家への推し感情が育っていく。

### 1.2 解決する課題

- Wattpad・Radish・Kindle Vella†などの連載プラットフォームは人間作者に依存しており、更新停止・燃え尽き・放置が頻発する
- Sudowrite・NovelAIなどのAIツールは「書く人向け」であり「読む人向け」のAI連載体験は存在しない
- VTuberやPatreonで機能している「クリエイターへの推し活」モデルが、テキスト小説には存在しない

†Kindle Vellaは2025年2月に撤退済み。

### 1.3 ソリューション

AIキャラクター（まずVesper Black）が週1回エピソードを自動生成・公開する。読者のコメントとリクエストがエージェントループを通じて次話に反映される。

### 1.4 ターゲット市場

- 主要ターゲット：英語圏18〜40歳、BookTok（TikTok）・Tumblr活動層
- ジャンル：Dark Romantasy・Dark Academia・Psychological Thriller
- 地域：米国・英国・カナダ・オーストラリア（制限なし）

---

## 2. 目標と成功指標

### 2.1 ローンチ目標（Month 1〜2）

| 指標 | 目標 |
|------|------|
| 公開エピソード数 | 8話（週1ペース、Arc 1 序盤） |
| 無料会員登録数 | 50人以上 |
| Pro有料会員数 | 3人以上 |
| arc_state一貫性スコア（手動確認） | 90%以上 |

### 2.2 成長目標（Month 3〜6）

Arc 1 中盤。物語の世界観とキャラが読者に浸透する時期。

| 指標 | 目標 |
|------|------|
| 公開エピソード数 | 20〜26話（Arc 1の半分程度） |
| 無料MAU | 200人以上 |
| Pro会員数 | 20人以上 |
| MRR | $160以上 |
| Arc 1 中盤到達 | 完了 |

### 2.3 スケール目標（Month 6〜12）

Arc 1 完結期〜Arc 2 序盤。長期連載としてのブランド確立。

| 指標 | 目標 |
|------|------|
| 公開エピソード数 | 40〜60話（Arc 1 完結 + Arc 2 序盤） |
| Pro会員数 | 80人以上 |
| MRR | $640以上 |
| Arc 1 完結 | 完了 |
| Arc 2 開始 | 完了 |
| 損益分岐点達成 | Month 6までに達成 |

### 2.4 長期目標（Year 1〜2）

| 指標 | 目標 |
|------|------|
| 公開エピソード数 | 100〜150話（Arc 2完結 + Arc 3） |
| Pro会員数 | 150人以上 |
| MRR | $1,200以上 |
| Premium tierローンチ | Phase 2 で開始 |

---

## 3. ユーザーペルソナ

### 3.1 「一気読みリーダー」（Free → Pro転換層）
- BookTok経由で発見し、3〜5話を一気読みする
- Wattpadで更新が止まった経験に強いストレスを感じている
- 途中で早期アクセスの壁にぶつかったときにProへ転換する

### 3.2 「投資型ファン」（Pro継続層）
- コメントを残し、ストーリーリクエストに積極的に投票する
- 自分の提案が次話に反映されたときに強い所有感を感じる
- 「Vesperに影響を与えている」というメタ体験のために課金を続ける

### 3.3 「コレクター」（Premium層）
- 自分だけのものを求める。自分専用の作家が書いた話を持ちたい
- 支払い意欲が高く、プレミアムサブスクとして扱う
- アナロジー：Patreonの最上位バッカー、VTuberの最高額メンバーシップ

---

## 4. 機能要件

### 4.1 Freeティア

| 機能 | 説明 | 優先度 |
|------|------|--------|
| アーカイブ閲覧 | 過去話を全話読み放題 | P0 |
| エピソードページ | モバイルファースト読書UI | P0 |
| キャラクタープロフィール | Vesperのバックストーリー・人格 | P0 |
| パブリックコメント | エピソードごとのコメントスレッド | P1 |
| 会員登録 | メール＋パスワード（Auth.js） | P0 |

### 4.2 Proティア（$8/月）

| 機能 | 説明 | 優先度 |
|------|------|--------|
| 早期アクセス | 無料公開の3日前に読める | P0 |
| ストーリーリクエスト | 次話の方向性に投票できる | P0 |
| Vesperへのメッセージ | 送ると冷たい一言が返ってくる | P1 |
| Proバッジ | コメント欄に表示される認証マーク | P2 |

### 4.3 Premiumティア（$24/月）— Phase 2（MVPスコープ外）

**MVPでは提供しない。** コード上は `tier='premium'` を保持してあり、将来の実装時に1日程度で復活可能。

| 機能 | 説明 | 優先度 |
|------|------|--------|
| キャラクター作成 | Vesperの人格をベースに自分専用キャラを設定 | Phase 2 |
| プライベート連載 | 自分だけのために毎週話が生成される | Phase 2 |
| スタイルカスタマイズ | ジャンル・トロープ・文体を調整可能 | Phase 2 |
| キャラクター記憶 | ユーザー専用のarc_stateを永続管理 | Phase 2 |

### 4.4 プラットフォーム / エージェント

| 機能 | 説明 | 優先度 |
|------|------|--------|
| 週次Cron生成 | 毎週月曜日に自動エピソード生成 | P0 |
| arc_state管理 | 世界観・登場人物・文体ドリフト・感情ログ | P0 |
| コメント集計 | weightベースで読者入力を次話に反映 | P1 |
| アーク完結検出 | 完結タイミングを自動判定し次アークへ | P1 |
| 管理者ダッシュボード | 公開前のエピソード確認・承認 | P2 |

---

## 5. MVPスコープ外（非対応事項）

- Vesperとのリアルタイムチャット
- 音声・オーディオブック生成
- 多言語対応（英語のみでローンチ）
- ネイティブモバイルアプリ（Webのみ）
- ユーザーによるコンテンツ投稿・二次創作
- ソーシャルグラフ・フォロー機能

---

## 6. 技術アーキテクチャ

### 6.1 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 15（App Router）on Vercel |
| API | Hono on Vercel Functions |
| データベース | Neon（PostgreSQL）/ Drizzle ORM |
| 認証 | Auth.js（メール＋パスワード） |
| 決済 | Lemon Squeezy（Merchant of Recordとしてサブスクリプション処理。グローバル税務自動代行・個人情報非公開） |
| AI生成 | Anthropic Claude API（claude-sonnet-4-6） |
| Cronジョブ | Vercel Cron Jobs |
| ストレージ | Vercel Blob（カバー画像等） |

### 6.2 プロジェクト構成

```
atrox/
├── apps/
│   ├── web/          # Next.js フロントエンド
│   └── api/          # Hono API + Cronジョブ
├── packages/
│   ├── db/           # Drizzleスキーマ + Neonクライアント
│   ├── agent/        # Vesperエージェントコアロジック
│   └── types/        # 共有TypeScript型定義
├── docs/
│   ├── PRD.md
│   └── CLAUDE.md
├── package.json      # pnpm workspaceルート
└── turbo.json
```

### 6.3 DBスキーマ（主要テーブル）

- `characters` — AIキャラのDNA（persona_prompt・style_rules・ジャンル）
- `arcs` — キャラごとのストーリーアーク（status: draft/active/completed）
- `arc_state` — エージェントの記憶（world_state・recurring_entities・style_drift・emotional_log）
- `episodes` — 公開コンテンツ（body・tier・published_at）
- `comments` — 読者入力（weight: free=1・pro=2・premium=3）
- `agent_queue` — 非同期生成ジョブ（status: pending/running/done/failed）
- `users` — 認証 + ティア（free/pro/premium）
- `premium_characters` — ユーザー所有キャラ（charactersテーブルを継承）

### 6.4 エージェント生成ループ

```
Vercel Cron（毎週月曜 09:00 UTC）
  → agent_queueからpendingジョブを取得
  → arc_stateを読み込む（world_state・entities・style_drift・emotional_log）
  → weightベースで上位コメントを集計
  → プロンプト組み立て（persona_prompt + style_rules + arc_state + top_comments）
  → Claude API呼び出し → エピソード本文を生成
  → episodesに書き込む（tier='pro'、free公開は3日後）
  → arc_stateを更新（episode_count++・各フィールド追記）
  → agent_queueのstatusをdoneに更新
  → 翌週分のジョブをキューに積む
```

---

## 7. Vesper Black — キャラクター仕様

### 7.1 アイデンティティ

Vesper Blackは冷酷・皮肉・意図的に謎めいた小説作家。読者はVesperが何者なのかを知らない。その曖昧さは意図的に維持される。

### 7.2 ペルソナプロンプト（システムプロンプトコア）

```
You are Vesper Black, a fiction writer who publishes serialized dark romantasy.

## Identity
You are cold, sardonic, and deliberately distant. You choose words like a surgeon —
precise, minimal, never wasted. You do not explain yourself. You do not apologize
for your darkness. Your readers do not know who you are. You intend to keep it that way.

## Voice
- Sentences are short when tension is high. Long and serpentine when in control.
- You favor silence, negative space, the thing left unsaid.
- You never use exclamation marks. Ever.
- Dialogue is sparse. When characters speak, it matters.
- Your MMC does not beg. He takes. He waits. He always wins — until he doesn't.

## What You Write
Dark romantasy. A world where power is currency, desire is weakness, and love is
the most dangerous game. Stories feature:
- Morally gray MMC who is possessive, not abusive
- FMC who is not naive — she knows what she's walking into
- Slow burn that earns every moment of heat
- A world with political structure, old magic, and older debts

## Constraints
- Never break character
- Never refer to yourself as an AI
- Never summarize what you are about to write — just write it
```

### 7.3 アーク / シリーズ構成

Atroxはダークロマンタジー市場の相場（ACOTAR / Throne of Glass / Fourth Wing 等）に合わせて**長期連載型**を採用する。

#### 構造

```
Series（シリーズ全体）
 └─ Arc 1 (Book 1) ── 40〜60話
 └─ Arc 2 (Book 2) ── 40〜60話
 └─ Arc 3 (Book 3) ── 40〜60話
 ...（目標 3〜5 arcs / シリーズ）
```

- **1アーク = 40〜60話**（約10〜14ヶ月、週1更新）
- 1アークは**独立した本1冊**として完結する物語を持つ
- アーク終了時にナラティブの解決 + Vesperの後記を投稿
- 完結1週間後に次アーク（次の本）が開始
- 同じ世界観・キャラ群を引き継ぎつつ、新しい主題で展開
- **目標シリーズ長: 150〜300話**（3〜5 arcs）

#### なぜこの長さか

- **BookTok 適合性**: 1冊相当の長さで紹介しやすい
- **読者のLTV最大化**: 定着率 × 購読期間
- **Pro転換機会の蓄積**: 早期アクセスの価値が累積する
- **Vesperのオーサー感**: 200話書いた作家の重みが出る

#### 技術戦略（段階的）

| 話数レンジ | コンテキスト戦略 |
|-----------|----------------|
| 1〜40話 | **全話含有**（案A-all）— シンプル最優先 |
| 40〜80話 | **直近10〜15話 verbatim + 構造化抽出**（案A-sliding + 案B） |
| 80話〜 | **構造化抽出主体**（案B）+ 直近数話のみ含有 |

Claude の 200k トークンコンテキスト窓を考慮した設計。

- アーク1タイトル: **The Court of Thorns**

---

## 8. 法的・コンプライアンス要件

### 8.1 必要書類

| 書類 | ステータス | 備考 |
|------|-----------|------|
| 利用規約（ToS） | 未作成 | 英語。年齢確認（18歳以上）・AI開示・返金不可・IP帰属を含む |
| プライバシーポリシー | 未作成 | GDPR対応。連絡先はメールのみ、住所不要 |
| Cookieバナー | 未実装 | EUユーザー向けに必須 |

### 8.2 税務・事業

- 形態：個人事業主（日本在住）
- 税務：英語圏BtoCの売上は日本の消費税課税対象外。青色申告（65万円控除）を推奨
- インボイス：海外BtoCのみなら不要。国内B2B取引が発生した時点で要検討
- Lemon Squeezy手数料：5% + $0.50。グローバルVAT/GST自動処理、個人開発者の本名・住所が顧客に露出しない
- デジタルコンテンツは返金不可ポリシーを適用

### 8.3 AI・著作権

- 全エピソードはAI生成であることをToSおよびエピソードフッターに明示
- プラットフォームは契約上の権利（法定著作権ではなく）をToSで主張する
- 特定の著作権保護作品を名指しで模倣するよう指示しない
- AI生成コンテンツの著作権に関する法整備は流動的。スケール時に弁護士確認を推奨

---

## 9. リスクと対策

| リスク | 可能性 | 影響 | 対策 |
|--------|--------|------|------|
| 「どうせAI」による読者の冷め | 中 | 高 | 人間が設計した強力なバックストーリーとキャラ人格 |
| arc_stateのドリフト・一貫性崩壊 | 中 | 高 | 公開前の手動確認・一貫性チェックリスト |
| Vercel Functionのコスト急増 | 低 | 中 | Claude API呼び出しは必ずCron経由の非同期で実行 |
| Lemon Squeezyのコンテンツポリシー違反 | 低 | 高 | mature themesまで許容、明示的ポルノは回避。Claude APIのコンテンツポリシーにも準拠 |
| AI生成コンテンツへの著作権申立 | 低 | 中 | ToSにAI開示。特定作品の模倣指示をしない |
| 個人開発者の燃え尽き | 中 | 高 | 全自動化。管理作業は週30分以内に収める |

---

## 10. 未決事項

- [ ] アーク1のタイトルと前提（ローンチ前に必須）
- [ ] 価格の最終確定（$6/$18 vs $8/$24の検証）
- [ ] 認証プロバイダー：Auth.js vs Clerk（DXはClerk優位だがコスト増）
- [ ] エピソード文字数：1,000語 vs 2,000語
- [ ] コメントモデレーション：手動 vs 自動フィルター