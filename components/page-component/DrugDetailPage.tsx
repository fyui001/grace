'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { ExternalLink } from 'lucide-react'
import NoteRenderer from 'components/common/NoteRenderer'

interface DrugDetailPageProps {
  drug: {
    id: number
    name: string
    url: string
    note: string | null
  }
}

export default function DrugDetailPage({ drug }: DrugDetailPageProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{drug.name || '薬詳細'}</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/medication/drugs/${drug.id}/edit`)}
        >
          編集
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">薬名</dt>
              <dd className="text-sm mt-1">{drug.name || '-'}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-sm text-muted-foreground">リンク</dt>
              <dd className="text-sm mt-1">
                {drug.url ? (
                  <a
                    href={drug.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline break-all"
                  >
                    {drug.url}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  '-'
                )}
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
          {drug.note ? (
            <NoteRenderer note={drug.note} />
          ) : (
            <p className="text-muted-foreground">備考はありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
