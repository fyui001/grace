'use client'

import { useRouter } from 'next/navigation'
import { Button } from 'components/ui/button'
import { Info } from 'lucide-react'

interface DiscordLinkPromptProps {
  children: React.ReactNode
}

export default function DiscordLinkPrompt({
  children,
}: DiscordLinkPromptProps) {
  const router = useRouter()

  return (
    <div className="relative rounded-2xl border overflow-hidden">
      <div className="opacity-15 pointer-events-none select-none blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-background/80 to-background p-8 text-center">
        <Info className="size-8 text-primary" />
        <h3 className="text-lg font-semibold">Discordと連携してデータを表示</h3>
        <p className="text-sm text-muted-foreground">
          Discord
          Botと連携すると、服薬記録の登録やリマインダー通知が利用できます。
        </p>
        <Button onClick={() => router.push('/settings')}>
          設定画面で連携する
        </Button>
      </div>
    </div>
  )
}
