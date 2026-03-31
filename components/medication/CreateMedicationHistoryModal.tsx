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
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'components/ui/command'
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react'
import { cn } from 'lib/utils'
import { useApiClient } from 'client/apiClient'
import { medicationRepository } from 'repository/medicationRepository'

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
    <Dialog open={visible} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>服薬を記録</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          {entries.map((entry, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center text-sm font-semibold text-muted-foreground">
                {index + 1}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {index === 0 && <Label>薬</Label>}
                <DrugCombobox
                  drugs={drugs}
                  value={entry.drugId}
                  onChange={(value) => updateEntry(index, 'drugId', value)}
                />
              </div>
              <div className="flex w-32 flex-col gap-2">
                {index === 0 && <Label>服薬量(mg)</Label>}
                <Input
                  value={entry.amount}
                  onChange={(e) => updateEntry(index, 'amount', e.target.value)}
                  type="number"
                  placeholder="mg"
                />
              </div>
              <div className="shrink-0 pb-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={entries.length <= 1}
                  onClick={() => removeEntry(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {entries.length < 10 && (
            <Button variant="ghost" className="self-start" onClick={addEntry}>
              <Plus className="size-4" />
              追加（{entries.length}/10）
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleDismiss}>
            キャンセル
          </Button>
          <Button
            disabled={submitting || validEntries.length === 0}
            onClick={handleSubmit}
          >
            {submitting
              ? '記録中...'
              : validEntries.length > 1
                ? `${validEntries.length}件を記録`
                : '記録する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DrugCombobox({
  drugs,
  value,
  onChange,
}: {
  drugs: Drug[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedDrug = drugs.find((d) => d.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedDrug ? selectedDrug.name : '薬を選択'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="薬名で検索" />
          <CommandList>
            <CommandEmpty>見つかりませんでした</CommandEmpty>
            <CommandGroup>
              {drugs.map((drug) => (
                <CommandItem
                  key={drug.id}
                  value={drug.name}
                  onSelect={() => {
                    onChange(drug.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === drug.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {drug.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
