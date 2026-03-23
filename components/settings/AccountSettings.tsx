import {
  Box,
  Button,
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
} from '@cloudscape-design/components'

interface AccountSettingsProps {
  email: string
  plan: string
  onLogout: () => void
}

export default function AccountSettings({
  email,
  plan,
  onLogout,
}: AccountSettingsProps) {
  return (
    <Container header={<Header variant="h2">アカウント</Header>}>
      <SpaceBetween size="l">
        <KeyValuePairs
          columns={2}
          items={[
            { label: 'メールアドレス', value: email },
            { label: 'プラン', value: plan },
          ]}
        />
        <Box>
          <Button variant="normal" onClick={onLogout}>
            ログアウト
          </Button>
        </Box>
      </SpaceBetween>
    </Container>
  )
}
