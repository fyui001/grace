'use client'

import { useMemo, useRef, useState } from 'react'
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
import type { OutputData } from '@editorjs/editorjs'
import { useApiClient } from 'client/apiClient'
import { drugRepository } from 'repository/drugRepository'
import EditorJsEditor from 'components/common/EditorJsEditor'

function parseNoteData(note: string | null): OutputData | null {
  if (!note) return null
  try {
    return JSON.parse(note) as OutputData
  } catch {
    return null
  }
}

interface DrugEditPageProps {
  drug: {
    id: number
    name: string
    url: string
    note: string | null
  }
}

export default function DrugEditPage({ drug }: DrugEditPageProps) {
  const router = useRouter()
  const apiClient = useApiClient()
  const [name, setName] = useState(drug.name)
  const [url, setUrl] = useState(drug.url)
  const noteDataRef = useRef<OutputData | null>(parseNoteData(drug.note))
  const initialNoteData = useMemo(
    () => parseNoteData(drug.note),
    [drug.note],
  )
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    const noteJson = noteDataRef.current
      ? JSON.stringify(noteDataRef.current)
      : null
    const success = await drugRepository.updateDrug(apiClient, drug.id, {
      drugName: name,
      url,
      note: noteJson,
    })
    setSubmitting(false)
    if (success) {
      router.replace(`/medication/drugs/${drug.id}`)
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
          <Button
            variant="primary"
            loading={submitting}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        <Header variant="h1">薬を編集</Header>

        <Container header={<Header variant="h2">基本情報</Header>}>
          <SpaceBetween size="l">
            <FormField label="薬名">
              <Input
                value={name}
                onChange={({ detail }) => setName(detail.value)}
                autoFocus
              />
            </FormField>
            <FormField label="URL">
              <Input
                value={url}
                onChange={({ detail }) => setUrl(detail.value)}
                type="url"
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">備考</Header>}>
          <EditorJsEditor
            data={initialNoteData}
            onChange={(data) => {
              noteDataRef.current = data
            }}
          />
        </Container>
      </SpaceBetween>
    </Form>
  )
}
