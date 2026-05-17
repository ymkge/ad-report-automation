# 広告運用レポート自動化 (Ad Report Automation)

## 概要 (Overview)
本プロジェクトは、クライアント15社分の広告運用（Google Ads / Meta Ads）レポート作成業務を完全自動化するためのデータパイプラインおよびBIダッシュボード構築プロジェクトです。
毎月末に発生している手作業によるレポート集計作業を撤廃し、工数を「ゼロ（確認のみ）」にすることを目指します。

## プロジェクト制約事項 (Project Constraints)
- **期間**: 12週間（約3ヶ月）
- **リソース制限**: **月20時間（週約5時間）稼働**
- **運用方針**: 納品後の運用は非エンジニアのクライアント担当者が行うため、保守性の高いシンプルな構成を維持します。

## 技術スタック (Tech Stack)
- **データ抽出 (EL)**: Google Apps Script (GAS) または Python (軽量スクリプト)
- **データソース**: Google Ads API, Meta Graph API
- **データ蓄積・管理**: Google Spreadsheet
- **BI / レポート出力**: Looker Studio (標準のPDF定期配信機能を最大限活用)

## システムアーキテクチャ (Architecture)
1. **Extract & Load**: GAS（またはPython）により各種広告APIから日次データを抽出し、スプレッドシートへ書き込み。
2. **Storage & Transform**: スプレッドシート上でデータを蓄積し、Looker Studioが読み込みやすい形式（フラットなテーブル）に整形。
3. **Visualize & Export**: Looker Studioで可視化し、標準機能を利用してPDFレポートを定期配信。

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
│   ├── extract/         # Pythonを用いたAPIデータ取得スクリプト (使用する場合)
│   ├── export/          # PDF自動生成スクリプト (標準機能で不足する場合)
│   └── gas/             # Google Apps Script コード
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
```
### 2. 認証情報の管理（シークレット）
本プロジェクトでは、各広告APIにアクセスするためのシークレット情報（トークン等）を使用します。セキュリティ保護のため、これらは絶対にGitコミットしないでください。

GASで実装する場合:
- Meta APIトークンやGoogle Ads開発者トークンは、GASエディタの「プロジェクトの設定」>「スクリプトプロパティ」に環境変数として登録して使用します。
- ローカルPythonでPoC（概念実証）を行う場合:リポジトリ直下に .env ファイルを作成し、必要なAPIトークンを記述してください（.gitignore で除外設定済みです）。