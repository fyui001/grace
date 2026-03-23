'use client'

import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  FormField,
  Header,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components'
import { useApiClient } from 'client/apiClient'
import { drugRepository } from 'repository/drugRepository'

interface CreateDrugModalProps {
  visible: boolean
  onDismiss: () => void
  onCreated: () => void
}

export default function CreateDrugModal({
  visible,
  onDismiss,
  onCreated,
}: CreateDrugModalProps) {
  const apiClient = useApiClient()
  const [drugName, setDrugName] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setDrugName('')
    setUrl('')
    setError(null)
    setSubmitting(false)
  }, [])

  const handleDismiss = useCallback(() => {
    reset()
    onDismiss()
  }, [reset, onDismiss])

  const handleSubmit = useCallback(async () => {
    if (!drugName.trim()) {
      setError('薬名を入力してください')
      return
    }

    setSubmitting(true)
    setError(null)

    const success = await drugRepository.createDrug(apiClient, {
      drugName: drugName.trim(),
      url: url.trim(),
    })

    setSubmitting(false)

    if (success) {
      reset()
      onCreated()
    } else {
      setError('登録に失敗しました。もう一度お試しください。')
    }
  }, [apiClient, drugName, url, reset, onCreated])

  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      header={<Header variant="h2">薬を登録</Header>}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleDismiss}>
              キャンセル
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={handleSubmit}
            >
              登録する
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="l">
        {error && (
          <Box color="text-status-error" fontSize="body-s">
            {error}
          </Box>
        )}
        <FormField label="薬名">
          <Input
            value={drugName}
            onChange={({ detail }) => setDrugName(detail.value)}
            placeholder="薬名を入力"
            autoFocus
          />
        </FormField>
        <FormField label="URL" description="- optional">
          <Input
            value={url}
            onChange={({ detail }) => setUrl(detail.value)}
            placeholder="https://..."
            type="url"
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  )
}
