# Grace

服薬管理アプリケーション「Grace」のフロントエンド。バックエンドは Sophia。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| 言語 | TypeScript (strict mode) |
| UIライブラリ | Cloudscape Design System |
| スタイリング | Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`) |
| APIクライアント | openapi-fetch (OpenAPI specから型自動生成) |
| コンポーネント開発 | Storybook 10 |
| パッケージマネージャ | Yarn |
| タスクランナー | Task (Taskfile.yml, Docker内で実行) |
| React | 19.x |

## コマンド

すべて Docker コンテナ内で `task` 経由で実行する。

| コマンド | 用途 |
|---|---|
| `task dev` | 開発サーバー起動 |
| `task build` | プロダクションビルド |
| `task lint` | ESLint + Prettier チェック |
| `task typecheck` | TypeScript 型チェック |
| `task storybook` | Storybook 起動 (port 6006) |
| `task codegen` | OpenAPI spec から型生成 |
| `task prettier` | Prettier 自動修正 |

## アーキテクチャ

### ディレクトリ構成

```
app/                        # Next.js App Router ルート
  layout.tsx                 # ルートレイアウト (ThemeProvider, グローバルCSS)
  page.tsx                   # ホーム (Server Component)
  auth/login/                # ログインページ
  dashboard/                 # ダッシュボード
  settings/                  # 設定ページ
  setup/                     # 初期登録ページ

components/
  auth/login/                # ログイン関連コンポーネント
  layout/                    # AppShell (サイドナビゲーション付きレイアウト)
  setup/                     # 初期登録 (SetupPage, SetupForm)
  theme/                     # ThemeProvider (ダークモード管理)
  page-component/            # ページレベルのクライアントコンポーネント

client/
  apiClient.ts               # クライアントサイド API クライアント (useApiClient hook)
  serverApiClient.ts         # サーバーサイド API クライアント

repository/
  userRepository.ts          # ユーザーデータアクセス層
  types.ts                   # ClientType 定義

libs/
  api/generated/sophia.ts    # OpenAPI 自動生成型 (手動編集禁止)
  api/schema/                # OpenAPI spec JSON

utils/
  urls.ts                    # URL パス定数・ヘルパー

stories/                     # Storybook ストーリー
.storybook/                  # Storybook 設定
```

### データフェッチパターン

Server Component → API Client → Repository → Client Component (props経由)

```
Server Component (app/page.tsx)
  → createServerApiClient() (SSR_API_BASE_PATH 使用)
  → repository 関数でデータ取得
  → props で Client Component に渡す
```

- ルートページは Server Component でデータ取得
- `'use client'` はインタラクティブなコンポーネントにのみ使用
- Client Component での API 呼び出しはミューテーション（登録・更新）のみ

### Repository パターン

```typescript
export const userRepository = {
  async getCurrentUser(apiClient: ClientType) {
    const result = await apiClient.GET('/api/user')
    if (!result.data) return null
    return result.data.data
  },
}
```

- `repository/` に配置、ドメインごとにファイル分割
- 各メソッドは `ClientType` (openapi-fetch Client) を第一引数に取る
- API パスは必ず `/` 始まり
- レスポンスの null チェック必須
- サーバーサイド・クライアントサイド共通で使用（異なるクライアントインスタンス）

### API クライアント

- **サーバーサイド**: `createServerApiClient({ cookie })` — `SSR_API_BASE_PATH` 環境変数使用
- **クライアントサイド**: `useApiClient()` — React hook、`useMemo` で生成

### 型の導出

- API 型は `libs/api/generated/sophia.ts` から自動生成（`task codegen`）
- `client/api.d.ts` は手動編集禁止
- コンポーネントの props 型は `Awaited<ReturnType<typeof repository.method>>` パターンで導出

### Middleware

`middleware.ts` で以下を処理:

1. テーマ Cookie 読み取り → `x-theme-mode` リクエストヘッダー設定
2. 認証チェック (API 経由でユーザー取得)
3. 未登録ユーザーの `/setup` リダイレクト

### テーマ (ダークモード)

- **Middleware**: Cookie (`grace-theme-mode`) を読み取り、`x-theme-mode` ヘッダーに設定
- **Layout**: `headers()` でテーマ取得、`body` クラスと `ThemeProvider` の `initialMode` を SSR 時点で確定
- **ThemeProvider**: `initialMode` props で初期化、`applyMode()` でトグル、Cookie に永続化
- **useEffect 禁止**: 初期値の遅延同期は厳禁。SSR で初期値を確定させること

### AppLayout レイアウトシフト対策

Cloudscape の `AppLayout` は SSR 時に `window` がないため幅を正しく計算できない。
`AppShell` で ref コールバックを使い、hydration 完了まで `opacity: 0` で非表示にしてシフトを防止。

## コンポーネント設計

### ファイル命名規則

- **PascalCase** で命名: `SetupForm.tsx`, `LoginRequired.tsx`
- **Page コンポーネント**: `*Page.tsx` (`SetupPage.tsx`, `DashboardPage.tsx`)
- **フォーム/機能コンポーネント**: 機能名で命名 (`SetupForm.tsx`, `LoginRequired.tsx`)

### コンポーネント配置

- `components/{feature}/` — 機能ドメインごとにディレクトリ分割
- `components/layout/` — レイアウト関連 (AppShell)
- `components/theme/` — テーマ管理
- `app/{route}/` — ルート固有のページコンポーネント (SettingsPage.tsx)

### Cloudscape Design System

- UIプリミティブはすべて Cloudscape を使用
- `@cloudscape-design/global-styles` でテーマ適用 (`applyMode`)
- `next.config.ts` に `transpilePackages` 設定必須
- コンポーネントドキュメント: `https://cloudscape.design/components/{name}/index.html.md`

#### レイアウトルール

- **ContentLayout は CRUD 操作に使用禁止** — ランディング/マーケティングページ専用
- **Container のネスト禁止** — 内部セクションには Header コンポーネントを使用
- Container 間は `SpaceBetween size="l"` で配置
- AppLayout の `contentType` を適切に設定 (`"form"`, `"table"`, `"dashboard"` 等)

#### フォーム

- **`<form>` タグまたは `role="form"` で囲む必須** — Form コンポーネント自体に form role はない
- **アクションボタンを非活性にしない** — バリデーションで制御
- 最初のフィールドに自動フォーカス
- バリデーション失敗時は最初のエラーフィールドにフォーカス
- FormField のラベル: 1-3語、句読点なし
- 必須フィールドにマーク不要、任意フィールドに「- optional」

#### ボタン

- **Primary ボタンはページごとに1つのみ**
- ボタンを非表示にせず非活性にする（`disabledReason` でツールチップ）
- ボタン間は `SpaceBetween size="xs"`

#### スペーシング

- 基本単位: 4px
- コンテナ間: `SpaceBetween size="l"` (20px)
- フォームフィールド間: `SpaceBetween size="l"` (縦) / `size="s"` (横)
- ボタン間: `SpaceBetween size="xs"` (8px)

#### テーブル

- 第1列: 一意識別子 + ナビゲーションリンク、第2列: ステータス
- テキスト左揃え、数値右揃え、空値はハイフン (-)
- `trackBy` でアイテムID指定（配列インデックス禁止）

#### 色・アクセシビリティ

- デザイントークンを使用、生の Hex 値は使用禁止
- 色だけで情報を伝えない（アイコン・テキスト併用）
- 320px viewport と 400% ブラウザズームでテスト

### スタイリング

- Cloudscape コンポーネントのスタイルはそのまま使用
- カスタムスタイルが必要な場合は `@emotion/styled` を使用
- インラインスタイルは最小限に（レイアウト用の `maxWidth`, `margin` 程度）

### Storybook

- すべてのページコンポーネントに Story を作成
- `stories/decorators.tsx` に共通デコレータ (`withAppShell`, `withThemeProvider`)
- ThemeProvider が必要なコンポーネントは `withThemeProvider` デコレータを使用

## コーディング規約

- **セミコロンなし、シングルクォート** (Prettier: `{ "semi": false, "singleQuote": true }`)
- **ESLint**: `next/core-web-vitals` 準拠
- **TypeScript**: strict mode、`baseUrl: "."`
- **`react-hooks/exhaustive-deps`**: error レベルで検証
- **`'use client'`**: ページコンポーネントレベルでのみ使用

## Docker / インフラ

- **Dockerfile**: standalone 出力
- **compose.yml**: Traefik リバースプロキシ使用
  - アプリ: `grace.localhost` (port 3000)
  - Storybook: `grace-storybook.localhost` (port 6006)
  - 外部ネットワーク `docker_default` に接続
- **環境変数**: `NEXT_PUBLIC_API_BASE_PATH`, `SSR_API_BASE_PATH`
