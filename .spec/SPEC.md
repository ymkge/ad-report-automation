# システム仕様書 (軽量構成版)

## 1. アーキテクチャ
- **Data Source**: Google Ads API, Meta Graph API
- **Extract & Load**: GAS (Google Apps Script) または軽量なPythonスクリプト
- **Storage**: Google Spreadsheet
  - API設定用シート（非エンジニアでもパラメータを変更可能にする）
  - 生データ蓄積用シート
  - Looker Studio読み込み用の集計シート
- **BI & Export**: Looker Studio
  - 1つの統合ダッシュボードを作成し、クライアントごとにフィルタリングする設計を基本とする。
  - Looker Studioの「メール配信機能（スケジュール配信）」を活用し、PDF出力を自動化する。

## 2. 定期実行の仕組み
- GASの場合: GASの「時間主導型トリガー」を使用して日次実行。
- Pythonの場合: GitHub Actionsの定期実行 (cron) など、インフラ管理不要な仕組みを採用。