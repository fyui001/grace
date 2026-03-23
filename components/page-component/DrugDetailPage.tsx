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
import EditorJsRenderer from 'components/common/EditorJsRenderer'

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
    <SpaceBetween size="l">
      <Header
        variant="h1"
        actions={
          <Button onClick={() => router.push(`/medication/drugs/${drug.id}/edit`)}>
            編集
          </Button>
        }
      >
        {drug.name || '薬詳細'}
      </Header>

      <Container header={<Header variant="h2">基本情報</Header>}>
        <KeyValuePairs
          columns={2}
          items={[
            { label: '薬名', value: drug.name || '-' },
            {
              label: 'リンク',
              value: drug.url ? (
                <Link href={drug.url} external>
                  {drug.url}
                </Link>
              ) : (
                '-'
              ),
            },
          ]}
        />
      </Container>

      <Container header={<Header variant="h2">備考</Header>}>
        {drug.note ? (
          <EditorJsRenderer note={drug.note} />
        ) : (
          <p>備考はありません</p>
        )}
      </Container>
    </SpaceBetween>
  )
}
