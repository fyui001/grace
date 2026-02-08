import { Alert, Box, Button, Container, Header } from '@cloudscape-design/components'


export default function LoginRequired() {
  return (
      <Container header={<Header variant='h2'>ログイン</Header>}>
          <Alert header='ログインしてください' type='warning'>
              ログインが必要です。
          </Alert>
          <Box padding='xxxl' textAlign='center'>
              <Button
                ariaLabel='ログインページへ'
                iconAlign='left'
                iconName='key'
                variant='primary'
              >
                  ログインページへ
              </Button>
          </Box>
      </Container>
    )
}