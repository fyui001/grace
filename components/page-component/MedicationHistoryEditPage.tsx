'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Container,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components'
import { useApiClient } from 'client/apiClient'
import { medicationRepository } from 'repository/medicationRepository'
import NoteEditor from 'components/common/NoteEditor'

interface MedicationHistoryEditPageProps {
  history: {
    id: number
    drugName: string
    amount: number
    note: string | null
    createdAt: string
  }
}

export default function MedicationHistoryEditPage({
  history,
}: MedicationHistoryEditPageProps) {
  const router = useRouter()
  const apiClient = useApiClient()
  const [amount, setAmount] = useState(String(history.amount))
  const noteJsonRef = useRef<string | null>(history.note)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    const success = await medicationRepository.updateMedicationHistory(
      apiClient,
      history.id,
      {
        amount: Number(amount),
        note: noteJsonRef.current,
      },
    )
    setSubmitting(false)
    if (success) {
      router.replace(`/medication/history/${history.id}`)
      router.refresh()
    }
  }

  return (
    <Form
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link" onClick={() => router.back()}>
            キャンセル
          </Button>
          <Button variant="primary" loading={submitting} onClick={handleSubmit}>
            保存
          </Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        <Header variant="h1">服薬履歴を編集</Header>

        <Container header={<Header variant="h2">基本情報</Header>}>
          <SpaceBetween size="l">
            <FormField label="薬名">
              <Input value={history.drugName} disabled />
            </FormField>
            <FormField label="服薬日時">
              <Input
                value={history.createdAt.replace('T', ' ').substring(0, 16)}
                disabled
              />
            </FormField>
            <FormField label="服薬量(mg)">
              <Input
                value={amount}
                onChange={({ detail }) => setAmount(detail.value)}
                type="number"
                autoFocus
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">備考</Header>}>
          <NoteEditor
            data={history.note}
            onChange={(json) => {
              noteJsonRef.current = json
            }}
          />
        </Container>
      </SpaceBetween>
    </Form>
  )
}
