'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  Form,
  FormField,
  Header,
  Input,
  KeyValuePairs,
  SpaceBetween,
} from '@cloudscape-design/components'
import styled from '@emotion/styled'
import { useApiClient } from 'client/apiClient'
import { userRepository } from 'repository/userRepository'

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px;
`

export default function SetupForm({ email }: { email?: string }) {
  const router = useRouter()
  const apiClient = useApiClient()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('名前を入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      await userRepository.registerUser(apiClient, name.trim())
      router.push('/dashboard')
    } catch {
      setError('登録に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box padding={{ top: 'xxxl' }}>
      <Wrapper>
        <SpaceBetween size="l">
          <Box textAlign="center">
            <SpaceBetween size="xxs">
              <Box variant="h1" fontSize="heading-xl">
                Grace
              </Box>
              <Box variant="p" color="text-body-secondary">
                はじめに、あなたのプロフィールを設定しましょう
              </Box>
            </SpaceBetween>
          </Box>
          <Container header={<Header variant="h2">プロフィール設定</Header>}>
            <Form
              actions={
                <Box float="right">
                  <Button
                    variant="primary"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    はじめる
                  </Button>
                </Box>
              }
              errorText={error}
            >
              <SpaceBetween size="m">
                {email && (
                  <KeyValuePairs
                    items={[{ label: 'メールアドレス', value: email }]}
                  />
                )}
                <FormField
                  label="表示名"
                  description="アプリ内で使用される名前です"
                >
                  <Input
                    value={name}
                    onChange={({ detail }) => setName(detail.value)}
                    placeholder="例：太郎"
                    disabled={loading}
                  />
                </FormField>
              </SpaceBetween>
            </Form>
          </Container>
        </SpaceBetween>
      </Wrapper>
    </Box>
  )
}
