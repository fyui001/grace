import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'

interface AccountSettingsProps {
  userName: string
  authProvider: string
  onLogout: () => void
}

export default function AccountSettings({
  userName,
  authProvider,
  onLogout,
}: AccountSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>アカウント</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">表示名</dt>
              <dd className="text-sm mt-1">{userName || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">認証方法</dt>
              <dd className="text-sm mt-1">{authProvider}</dd>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={onLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
