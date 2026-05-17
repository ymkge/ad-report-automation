# 広告運用レポート自動化 システム仕様書 (v1.0)

## 1. システムアーキテクチャ
本システムは以下のデータパイプラインで構築する。
1. **Extract (データ抽出)**: Pythonスクリプトを定期実行し、Google Ads API / Meta Graph API から15社分のキャンペーン・広告グループ・日次レポートを抽出。
2. **Load (データロード)**: 抽出した生データを Google BigQuery にロードする。
3. **Transform (データ変換)**: dbt を用いて、BigQuery上の生データをLooker Studio用の集計マート（正規化、媒体横断での統合）に変換する。
4. **BI & Export (可視化と出力)**: 
   - Looker Studioで統合ダッシュボードを作成。
   - Python（Playwright/Puppeteer等）またはLooker Studioのエクスポート機能を活用し、クライアントごとのPDFレポートを自動生成する。
5. **Infrastructure**: 上記のGCPリソース（BigQuery、Cloud Run/Functions等）は Terraform でコード化し、管理する。

## 2. 対象データ
- Google Ads: インプレッション、クリック、コンバージョン、費用（日次/キャンペーン別）
- Meta Ads: インプレッション、クリック、コンバージョン、費用（日次/キャンペーン別）