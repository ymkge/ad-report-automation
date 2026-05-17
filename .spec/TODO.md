# 実装タスク一覧 (TODO.md)

## Phase 0: 事前確認事項（要件定義）
- [ ] **インフラ・環境の所有権の確認**
  - GCPプロジェクト、Looker Studio、BigQueryの請求先・所有権は「クライアント側」か「自社（開発側）」か。
- [ ] **バッチ処理の実行環境（オーケストレーション）の方針決定**
  - Pythonスクリプトやdbtの定期実行環境をどうするか。（例: Cloud Run Jobs + Cloud Scheduler, GitHub Actions, dbt Cloud等）
- [ ] **PDF自動化の要件と複雑度の確認**
  - 15社分のレポートは「同一レイアウト（フィルタ切り替えのみ）」か、「各社で個別のカスタムレイアウト」か。
  - レポートの出力頻度とタイミング（例: 毎月1日の朝9時までに前月分を出力等）。

## Phase 1: プロジェクト基盤とインフラ構築 (Terraform)
- [ ] GCPプロジェクトの作成（または既存環境の確認）
- [ ] Terraform実行用のサービスアカウント作成
- [ ] GCPリソースのTerraformコード実装（`infra/`）
  - [ ] BigQuery データセットの作成（`raw`, `staging`, `marts`）
  - [ ] 状態管理（tfstate）用Cloud Storageバケットの作成
  - [ ] （必要に応じて）実行環境用のリソース定義（Phase 0の確認結果に基づく）
- [ ] `terraform apply` による初期インフラのデプロイ

## Phase 2: データ抽出とロード (Extract & Load - Python)
- [ ] API認証情報の取得と検証
  - [ ] Google Ads API: MCCアカウントアクセス、開発者トークン取得、OAuth2リフレッシュトークン生成
  - [ ] Meta Graph API: ビジネスマネージャー連携、システムユーザー作成、無期限トークン発行
- [ ] データ抽出スクリプトの実装（`src/extract/`）
  - [ ] Google Ads APIからの日次レポート（インプレッション、クリック、CV、費用等）抽出処理
  - [ ] Meta Graph APIからの日次レポート抽出処理
  - [ ] APIのページネーション、レートリミット（429エラー等）のリトライ処理実装
- [ ] BigQueryへのデータロード処理実装
  - [ ] `google-cloud-bigquery` を用いた `raw` データセットへの追記・更新処理

## Phase 3: データ変換 (Transform - dbt)
- [ ] dbtプロジェクトの初期化（`src/transform/`）と `profiles.yml` の設定
- [ ] dbtモデルの実装
  - [ ] `staging`: Google Ads, Meta Adsの生データを正規化・型定義
  - [ ] `intermediate`: （必要に応じて）代理店・クライアントマスタとの結合
  - [ ] `marts`: 媒体横断の統合ダッシュボード用集計テーブル（クライアント別・日次サマリー等）の実装
- [ ] dbtテストとドキュメントの実装（`schema.yml` でのユニークテストや非Nullテスト）

## Phase 4: BIダッシュボード構築とPDF自動化
- [ ] Looker Studio ダッシュボードの作成
  - [ ] BigQuery `marts` データセットへの接続
  - [ ] クライアント15社向けのレポートUI/UX構築
- [ ] PDFレポート自動出力の検証・実装（`src/export/`）
  - [ ] Looker Studio標準の「定期配信」機能の検証（Phase 0の確認結果に基づく）
  - [ ] （標準機能で要件を満たせない場合）Python + Playwright等を用いた自動PDF出力スクリプトの実装