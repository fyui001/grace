import {
  Box,
  Button,
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
  StatusIndicator,
} from '@cloudscape-design/components'

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
    <Container header={<Header variant="h2">外部サービス連携</Header>}>
      <SpaceBetween size="l">
        <KeyValuePairs
          columns={2}
          items={[
            {
              label: 'Discord',
              value: discordUserId ? (
                <StatusIndicator type="success">
                  連携済み (ID: {discordUserId})
                </StatusIndicator>
              ) : (
                <StatusIndicator type="stopped">未連携</StatusIndicator>
              ),
            },
          ]}
        />
        <Box>
          {discordUserId ? (
            <Button
              variant="normal"
              loading={unlinking}
              onClick={onDiscordUnlink}
            >
              Discord連携を解除
            </Button>
          ) : (
            <Button variant="primary" onClick={onDiscordLink}>
              Discordと連携する
            </Button>
          )}
        </Box>
      </SpaceBetween>
    </Container>
  )
}
