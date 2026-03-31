'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useApiClient } from 'client/apiClient'
import { drugRepository } from 'repository/drugRepository'
import NoteEditor from 'components/common/NoteEditor'

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
  const noteJsonRef = useRef<string | null>(drug.note)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    const success = await drugRepository.updateDrug(apiClient, drug.id, {
      drugName: name,
      url,
      note: noteJsonRef.current,
    })
    setSubmitting(false)
    if (success) {
      router.replace(`/medication/drugs/${drug.id}`)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">薬を編集</h1>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="drug-name">薬名</Label>
              <Input
                id="drug-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="drug-url">URL</Label>
              <Input
                id="drug-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>備考</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteEditor
            data={drug.note}
            onChange={(json) => {
              noteJsonRef.current = json
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  )
}
