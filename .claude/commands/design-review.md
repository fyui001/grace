指定されたコンポーネントを shadcn/ui + Tailwind CSS のガイドラインに照らし合わせてレビューし、違反箇所を修正する。

## レビューチェックリスト

### レイアウト
- [ ] ページレイアウトが `<div className="flex flex-col gap-5">` パターンを使用しているか
- [ ] ヘッダー + アクションが `<div className="flex items-center justify-between">` か
- [ ] セクションに shadcn `Card` + `CardHeader` + `CardContent` を使用しているか
- [ ] Card がネストされていないか
- [ ] 中央揃えレイアウト（ログイン・セットアップ等）が `mx-auto max-w-md` で正しくセンタリングされているか
- [ ] AppShell 内のコンテンツにパディングが適用されているか

### フォーム
- [ ] `<form>` タグで囲まれているか
- [ ] shadcn `Input` + `Label` を使用しているか
- [ ] エラー表示に `<p className="text-sm text-destructive">` を使用しているか
- [ ] 最初のフィールドに `autoFocus` が設定されているか
- [ ] バリデーション失敗時に最初のエラーフィールドにフォーカスしているか
- [ ] 任意フィールドに `<span className="text-muted-foreground">- optional</span>` が付いているか
- [ ] フォームフィールド間に適切な `gap-5`（縦）/ `gap-3`（横）があるか

### ボタン
- [ ] Primary ボタン（default variant）がページごとに1つのみか
- [ ] Secondary ボタンに `variant="outline"` を使用しているか
- [ ] テキストリンク的ボタンに `variant="ghost"` を使用しているか
- [ ] ボタン間に `gap-2` があるか
- [ ] ボタンラベルが簡潔か（動詞+名詞の1-2語）

### ヘッダー
- [ ] ページごとに `<h1>` は1つのみか
- [ ] `<h1>` に `className="text-2xl font-bold"` を使用しているか
- [ ] Card 内の見出しに `CardTitle` を使用しているか

### テーブル
- [ ] `DataTable` / `PaginatedTable` を使用しているか
- [ ] `columnDefinitions` の `cell` で空値にハイフン (-) を表示しているか
- [ ] `trackBy` を使用しているか（配列インデックスは禁止）
- [ ] クリック可能な行に `onRowClick` を設定しているか

### スタイリング
- [ ] shadcn CSS カスタムプロパティを使用しているか（`text-foreground`, `bg-background` 等）
- [ ] 生の Hex 値を使っていないか（recharts のチャートカラーを除く）
- [ ] Tailwind ユーティリティクラスを使用しているか（インラインスタイルは動的な値のみ）
- [ ] `@emotion/styled` や Cloudscape の import が残っていないか
- [ ] 色だけで情報を伝えていないか（lucide アイコン・テキスト併用）

### テーマ・ダークモード
- [ ] ダークモード用の色が `dark:` variant で対応しているか
- [ ] ハードコードされた色がダークモードで見えなくならないか

### アクセシビリティ
- [ ] フォーム入力に `id` と `htmlFor` でラベルが紐づいているか
- [ ] アイコンのみのボタンにアクセシブルな名前があるか
- [ ] モーダルにフォーカストラップがあるか（shadcn Dialog は標準対応）

### Storybook
- [ ] 対象コンポーネントに Story が存在するか
- [ ] Story の props がコンポーネントの変更に追従しているか

## 手順

1. 指定パスのコンポーネントファイルを読み込む（未指定時は全コンポーネント）
2. 上記チェックリストの各項目を検証する
3. 違反箇所をファイルパス・行番号・該当ガイドラインとともに報告する
4. すべての違反を自動修正する
5. Storybook および実アプリのスクリーンショット（`npx playwright screenshot`）で修正結果を目視確認する

対象: $ARGUMENTS
