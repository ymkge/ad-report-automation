# 広告運用レポート自動化 (Ad Report Automation)

## 概要 (Overview)
本プロジェクトは、クライアントnn社分の広告運用（Google Ads / Meta Ads）レポート作成業務を完全自動化するためのデータパイプラインおよびBIダッシュボード構築プロジェクトです。
毎月末に発生している手作業によるレポート集計作業を撤廃し、工数を限りなく「ゼロ（確認のみ）」に近い状態にすることを目指します。


## 技術スタック (Tech Stack)
- **言語**: Python 3.11+
- **データ抽出 (EL)**: Google Ads API, Meta Graph API
- **データウェアハウス (DWH)**: Google BigQuery
- **データ変換 (Transform)**: dbt (Data Build Tool)
- **インフラ構成管理 (IaC)**: Terraform
- **BI / レポート出力**: Looker Studio, Python (PDF生成自動化)

## システムアーキテクチャ (Architecture)
1. **Extract**: Pythonスクリプトにより各種広告APIから日次データを抽出
2. **Load**: 抽出データをBigQueryのRawデータセットへロード
3. **Transform**: dbtを用いて、生データを正規化し、媒体横断の集計マートへ変換
4. **Visualize & Export**: Looker Studioで可視化し、PDFとして自動出力

## ディレクトリ構成 (Repository Structure)
本リポジトリは、AIエージェント（Gemini CLI等）を用いた仕様駆動開発（SDD: Specification-Driven Development）に最適化された構成になっています。

```text
.
├── .agent/              # AIエージェント用のコンテキストと記憶
│   ├── AGENTS.md        # 開発ルール・技術スタックの定義
│   ├── handoff/         # セッション間の引き継ぎメモ（HANDOFF.md）
│   └── memory/          # 開発中のハマりポイントや教訓（MEMORY.md）
├── .spec/               # 仕様駆動開発（SDD）用のドキュメント群
│   ├── PLAN.md          # 人間の初期メモ・要件
│   ├── SPEC.md          # AIが構造化したシステム仕様書
│   ├── TODO.md          # 実装タスク一覧
│   └── KNOWLEDGE.md     # 技術的な調査メモ
├── src/                 # 実装コード
│   ├── extract/         # APIデータ取得スクリプト
│   ├── transform/       # dbtプロジェクト
│   └── export/          # PDF自動生成スクリプト
├── infra/               # Terraform構成ファイル
├── GEMINI.md            # Gemini CLI用システムプロンプト
└── .gitignore           # Git除外設定
```

## 開発の進め方 (Development with AI Agent)
本プロジェクトでは、コードを直接書き始める前に `.spec/` ディレクトリのドキュメントを更新し、AIエージェントと仕様を合意してから実装に進みます。

1. **仕様の定義**: `PLAN.md` にやりたいことを書き、AIに `SPEC.md` と `TODO.md` を生成させる。
2. **作業の開始**: AIエージェント起動時に `.agent/` と `.spec/` のファイルをコンテキストとして読み込ませる。
3. **作業の引き継ぎ**: 開発セッション終了時、AIに現在の進捗と次のTODOを `.agent/handoff/HANDOFF.md` に記録させることで、次回再開時の文脈喪失を防ぐ。

## 環境構築 (Getting Started)

### 1. リポジトリのクローンと仮想環境のセットアップ
```bash
git clone [https://github.com/your-username/ad-report-automation.git](https://github.com/your-username/ad-report-automation.git)
cd ad-report-automation
python -m venv .venv
source .venv/bin/activate  # Windowsの場合は `.venv\Scripts\activate`
pip install -r requirements.txt # (必要に応じて作成)
```

### 2. 認証情報の配置（Git管理外）
GCPのサービスアカウントキーや各種APIトークンは `.env` ファイル、または指定のローカルパスに配置してください（`.gitignore` で除外設定済みです）。

### 3. インフラのデプロイ (Terraform)
```bash
cd infra
terraform init
terraform plan
terraform apply
```