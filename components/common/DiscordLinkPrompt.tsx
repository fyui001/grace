'use client'

import styled from '@emotion/styled'
import { Box, Button, Icon } from '@cloudscape-design/components'
import { useRouter } from 'next/navigation'

const PromptBanner = styled.div`
  position: relative;
  border: 1px solid var(--color-border-divider-default);
  border-radius: 16px;
  overflow: hidden;
`

const MockPreview = styled.div`
  opacity: 0.15;
  pointer-events: none;
  user-select: none;
  filter: blur(1px);
`

const OverlayContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--color-background-container-content);
  background: linear-gradient(
    180deg,
    color-mix(
        in srgb,
        var(--color-background-container-content) 80%,
        transparent
      )
      0%,
    var(--color-background-container-content) 100%
  );
  padding: 32px;
  text-align: center;
`

interface DiscordLinkPromptProps {
  children: React.ReactNode
}

export default function DiscordLinkPrompt({
  children,
}: DiscordLinkPromptProps) {
  const router = useRouter()

  return (
    <PromptBanner>
      <MockPreview>{children}</MockPreview>
      <OverlayContent>
        <Icon name="status-info" size="big" variant="link" />
        <Box variant="h3" textAlign="center">
          Discordと連携してデータを表示
        </Box>
        <Box variant="p" color="text-body-secondary" textAlign="center">
          Discord
          Botと連携すると、服薬記録の登録やリマインダー通知が利用できます。
        </Box>
        <Button variant="primary" onClick={() => router.push('/settings')}>
          設定画面で連携する
        </Button>
      </OverlayContent>
    </PromptBanner>
  )
}
