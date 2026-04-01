'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog'
import { ExternalLink, Trash2 } from 'lucide-react'
import NoteRenderer from 'components/common/NoteRenderer'
import { useApiClient } from 'client/apiClient'
import { medicationRepository } from 'repository/medicationRepository'
import dayjs from 'dayjs'

interface MedicationHistoryDetailPageProps {
  history: {
    id: number
    drugId: number
    drugName: string
    drugUrl: string
    amount: number
    note: string | null
    createdAt: string
    updatedAt: string
  }
}

export default function MedicationHistoryDetailPage({
  history,
}: MedicationHistoryDetailPageProps) {
  const router = useRouter()
  const apiClient = useApiClient()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await medicationRepository.deleteMedicationHistory(
      apiClient,
      history.id,
    )
    setDeleting(false)
    if (success) {
      router.replace('/medication/history')
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">服薬履歴詳細</h1>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={deleting}>
                <Trash2 className="size-4" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>服薬履歴を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。この服薬履歴が完全に削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/medication/history/${history.id}/edit`)
            }
          >
            編集
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">薬名</dt>
              <dd className="text-sm mt-1">
                <Link
                  href={`/medication/drugs/${history.drugId}`}
                  className="text-primary hover:underline"
                >
                  {history.drugName || '-'}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">服薬量</dt>
              <dd className="text-sm mt-1">{history.amount}mg</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">服薬日時</dt>
              <dd className="text-sm mt-1">
                {dayjs(history.createdAt).format('YYYY-MM-DD HH:mm')}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-sm text-muted-foreground">リンク</dt>
              <dd className="text-sm mt-1">
                {history.drugUrl ? (
                  <a
                    href={history.drugUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline break-all"
                  >
                    {history.drugUrl}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  '-'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">更新日時</dt>
              <dd className="text-sm mt-1">
                {dayjs(history.updatedAt).format('YYYY-MM-DD HH:mm')}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>備考</CardTitle>
        </CardHeader>
        <CardContent>
          {history.note ? (
            <NoteRenderer note={history.note} />
          ) : (
            <p className="text-muted-foreground">備考はありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
