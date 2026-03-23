'use client'

import {
  Button,
  Container,
  Header,
  KeyValuePairs,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components'
import { useRouter } from 'next/navigation'
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
    <SpaceBetween size="l">
      <Header
        variant="h1"
        actions={
          <Button onClick={() => router.push(`/medication/history/${history.id}/edit`)}>
            編集
          </Button>
        }
      >
        服薬履歴詳細
      </Header>

      <Container header={<Header variant="h2">基本情報</Header>}>
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: '薬名',
              value: (
                <Link href={`/medication/drugs/${history.drugId}`}>
                  {history.drugName || '-'}
                </Link>
              ),
            },
            {
              label: '服薬量',
              value: `${history.amount}mg`,
            },
            {
              label: '服薬日時',
              value: history.createdAt.replace('T', ' ').substring(0, 16),
            },
            {
              label: 'リンク',
              value: history.drugUrl ? (
                <Link href={history.drugUrl} external>
                  {history.drugUrl}
                </Link>
              ) : (
                '-'
              ),
            },
            {
              label: '更新日時',
              value: history.updatedAt.replace('T', ' ').substring(0, 16),
            },
          ]}
        />
      </Container>

      <Container header={<Header variant="h2">備考</Header>}>
        {history.note ? (
          <NoteRenderer note={history.note} />
        ) : (
          <p>備考はありません</p>
        )}
      </Container>
    </SpaceBetween>
  )
}
