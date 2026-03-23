import {
  Box,
  Button,
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
} from '@cloudscape-design/components'

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
    <Container header={<Header variant="h2">アカウント</Header>}>
      <SpaceBetween size="l">
        <KeyValuePairs
          columns={2}
          items={[
            { label: '表示名', value: userName || '-' },
            { label: '認証方法', value: authProvider },
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
