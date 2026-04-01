# Grace

服薬管理アプリケーションのフロントエンド。

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **APIクライアント**: openapi-fetch
- **コンポーネント開発**: Storybook
- **パッケージマネージャ**: Yarn
- **タスクランナー**: Task (Taskfile.yml)

## セットアップ

```bash
# Docker コンテナのビルド・起動
task up

# 依存パッケージのインストール
task yarn
```

## 開発

すべてのコマンドは Docker コンテナ内で `task` 経由で実行します。

```bash
# 開発サーバー起動
task dev

# ビルド
task build

# Lint (ESLint + Prettier)
task lint

# 型チェック
task typecheck

# Storybook 起動
task storybook

# OpenAPI spec から型生成
task codegen

# Prettier 自動修正
task prettier
```

## 関連サービス

- **Sophia** - バックエンド API
- **Lily** - Discord Bot
