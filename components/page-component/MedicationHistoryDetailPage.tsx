'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { ExternalLink } from 'lucide-react'
import NoteRenderer from 'components/common/NoteRenderer'

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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">服薬履歴詳細</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/medication/history/${history.id}/edit`)}
        >
          編集
        </Button>
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
                {history.createdAt.replace('T', ' ').substring(0, 16)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">リンク</dt>
              <dd className="text-sm mt-1">
                {history.drugUrl ? (
                  <a
                    href={history.drugUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {history.drugUrl}
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  '-'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">更新日時</dt>
              <dd className="text-sm mt-1">
                {history.updatedAt.replace('T', ' ').substring(0, 16)}
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
