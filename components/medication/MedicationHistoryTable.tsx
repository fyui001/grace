'use client'

import { Header, StatusIndicator, Table } from '@cloudscape-design/components'

interface MedicationRecord {
  id: string
  date: string
  name: string
  time: string
  status: string
}

export default function MedicationHistoryTable({
  items,
  loading,
}: {
  items: MedicationRecord[]
  loading?: boolean
}) {
  return (
    <Table
      variant="container"
      header={
        <Header variant="h2" counter={`(${items.length})`}>
          履歴一覧
        </Header>
      }
      loading={loading}
      loadingText="読み込み中"
      columnDefinitions={[
        {
          id: 'date',
          header: '日付',
          cell: (item) => item.date,
          sortingField: 'date',
        },
        { id: 'name', header: '薬名', cell: (item) => item.name },
        { id: 'time', header: '服薬時刻', cell: (item) => item.time },
        {
          id: 'status',
          header: 'ステータス',
          cell: (item) =>
            item.status === 'completed' ? (
              <StatusIndicator type="success">服薬済み</StatusIndicator>
            ) : (
              <StatusIndicator type="error">未服薬</StatusIndicator>
            ),
        },
      ]}
      items={items}
      trackBy="id"
      sortingDisabled
      empty="服薬履歴がありません"
    />
  )
}
