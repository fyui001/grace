'use client'

import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  FormField,
  Header,
  Input,
  Modal,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components'
import styled from '@emotion/styled'
import { useApiClient } from 'client/apiClient'
import { medicationRepository } from 'repository/medicationRepository'

const EntryRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
`

const EntryIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-body-secondary, #5f6b7a);
`

const RemoveButton = styled.div`
  flex-shrink: 0;
  padding-bottom: 2px;
`

interface Drug {
  id: string
  name: string
}

interface MedicationEntry {
  drugId: string
  amount: string
}

function emptyEntry(): MedicationEntry {
  return { drugId: '', amount: '' }
}

interface CreateMedicationHistoryModalProps {
  visible: boolean
  onDismiss: () => void
  onCreated: () => void
  drugs: Drug[]
}

export default function CreateMedicationHistoryModal({
  visible,
  onDismiss,
  onCreated,
  drugs,
}: CreateMedicationHistoryModalProps) {
  const apiClient = useApiClient()
  const [entries, setEntries] = useState<MedicationEntry[]>([emptyEntry()])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const drugOptions = drugs.map((d) => ({ value: d.id, label: d.name }))

  const updateEntry = useCallback(
    (index: number, field: keyof MedicationEntry, value: string) => {
      setEntries((prev) =>
        prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
      )
    },
    [],
  )

  const addEntry = useCallback(() => {
    setEntries((prev) => (prev.length < 10 ? [...prev, emptyEntry()] : prev))
  }, [])

  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const reset = useCallback(() => {
    setEntries([emptyEntry()])
    setError(null)
    setSubmitting(false)
  }, [])

  const handleDismiss = useCallback(() => {
    reset()
    onDismiss()
  }, [reset, onDismiss])

  const validEntries = entries.filter(
    (e) => e.drugId !== '' && e.amount !== '' && Number(e.amount) > 0,
  )

  const handleSubmit = useCallback(async () => {
    if (validEntries.length === 0) {
      setError('薬と服薬量を入力してください')
      return
    }

    setSubmitting(true)
    setError(null)

    const now = new Date().toISOString()
    let allSuccess = true

    for (const entry of validEntries) {
      const success = await medicationRepository.createMedicationHistory(
        apiClient,
        {
          drugId: Number(entry.drugId),
          amount: Number(entry.amount),
          medicationDate: now,
        },
      )
      if (!success) {
        allSuccess = false
        break
      }
    }

    setSubmitting(false)

    if (allSuccess) {
      reset()
      onCreated()
    } else {
      setError('登録に失敗しました。もう一度お試しください。')
    }
  }, [apiClient, validEntries, reset, onCreated])

  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      header={<Header variant="h2">服薬を記録</Header>}
      size="large"
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
              disabled={validEntries.length === 0}
            >
              {validEntries.length > 1
                ? `${validEntries.length}件を記録`
                : '記録する'}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        {error && (
          <Box color="text-status-error" fontSize="body-s">
            {error}
          </Box>
        )}

        {entries.map((entry, index) => (
          <EntryRow key={index}>
            <EntryIndex>{index + 1}</EntryIndex>
            <FormField label={index === 0 ? '薬' : undefined} stretch>
              <Select
                selectedOption={
                  drugOptions.find((o) => o.value === entry.drugId) ?? null
                }
                options={drugOptions}
                placeholder="薬を選択"
                filteringType="auto"
                filteringPlaceholder="薬名で検索"
                onChange={({ detail }) =>
                  updateEntry(
                    index,
                    'drugId',
                    detail.selectedOption.value ?? '',
                  )
                }
              />
            </FormField>
            <FormField label={index === 0 ? '服薬量(mg)' : undefined}>
              <Input
                value={entry.amount}
                onChange={({ detail }) =>
                  updateEntry(index, 'amount', detail.value)
                }
                type="number"
                placeholder="mg"
              />
            </FormField>
            <RemoveButton>
              <Button
                iconName="close"
                variant="icon"
                disabled={entries.length <= 1}
                onClick={() => removeEntry(index)}
              />
            </RemoveButton>
          </EntryRow>
        ))}

        {entries.length < 10 && (
          <Button iconName="add-plus" variant="link" onClick={addEntry}>
            追加（{entries.length}/10）
          </Button>
        )}
      </SpaceBetween>
    </Modal>
  )
}
