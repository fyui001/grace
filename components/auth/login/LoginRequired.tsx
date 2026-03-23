'use client'

import {
  Alert,
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components'
import styled from '@emotion/styled'
import { loginPath, loginPathWithReturnToURL } from 'utils/urls'

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px;
`

export default function LoginRequired({ returnTo }: { returnTo?: string }) {
  return (
    <Box padding={{ top: 'xxxl' }}>
      <Wrapper>
        <SpaceBetween size="l">
          <Box textAlign="center">
            <Box variant="h1" fontSize="heading-xl">
              Grace
            </Box>
          </Box>
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
        </SpaceBetween>
      </Wrapper>
    </Box>
  )
}
