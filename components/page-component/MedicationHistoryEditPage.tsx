'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
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
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <h1 className="text-2xl font-bold">服薬履歴を編集</h1>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="drug-name">薬名</Label>
              <Input id="drug-name" value={history.drugName} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="taken-at">服薬日時</Label>
              <Input
                id="taken-at"
                value={history.createdAt.replace('T', ' ').substring(0, 16)}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">服薬量(mg)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                autoFocus
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
            data={history.note}
            onChange={(json) => {
              noteJsonRef.current = json
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}
