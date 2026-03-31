import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Badge } from 'components/ui/badge'
import { CheckCircle2, MinusCircle } from 'lucide-react'

interface ExternalServiceSettingsProps {
  discordUserId: string | null
  unlinking: boolean
  onDiscordLink: () => void
  onDiscordUnlink: () => void
}

export default function ExternalServiceSettings({
  discordUserId,
  unlinking,
  onDiscordLink,
  onDiscordUnlink,
}: ExternalServiceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>外部サービス連携</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Discord</dt>
              <dd className="text-sm mt-1">
                {discordUserId ? (
                  <Badge
                    variant="outline"
                    className="gap-1 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle2 className="size-3" />
                    連携済み (ID: {discordUserId})
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1 text-muted-foreground"
                  >
                    <MinusCircle className="size-3" />
                    未連携
                  </Badge>
                )}
              </dd>
            </div>
          </dl>
          <div>
            {discordUserId ? (
              <Button
                variant="outline"
                disabled={unlinking}
                onClick={onDiscordUnlink}
              >
                {unlinking ? 'Discord連携を解除中...' : 'Discord連携を解除'}
              </Button>
            ) : (
              <Button onClick={onDiscordLink}>Discordと連携する</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
