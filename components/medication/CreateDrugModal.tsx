'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
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
    <Dialog open={visible} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>薬を登録</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="drug-name">薬名</Label>
            <Input
              id="drug-name"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              placeholder="薬名を入力"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="drug-url">
              URL <span className="text-muted-foreground">- optional</span>
            </Label>
            <Input
              id="drug-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleDismiss}>
            キャンセル
          </Button>
          <Button disabled={submitting} onClick={handleSubmit}>
            {submitting ? '登録中...' : '登録する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
