'use client'

import {
  Alert,
  Box,
  Button,
  Container,
  Header,
} from '@cloudscape-design/components'
import { loginPath, loginPathWithReturnToURL } from 'utils/urls'

export default function LoginRequired({
  returnTo,
}: {
  returnTo?: string
}) {
  return (
    <Container header={<Header variant="h2">ログイン</Header>}>
      <Alert header="ログインしてください" type="warning">
        このページを表示するにはログインが必要です。
      </Alert>
      <Box padding="xxxl" textAlign="center">
        <Button
          href={returnTo ? loginPathWithReturnToURL(returnTo) : loginPath}
          ariaLabel="ログインページへ"
          iconAlign="left"
          iconName="key"
          variant="primary"
        >
          ログインページへ
        </Button>
      </Box>
    </Container>
  )
}
