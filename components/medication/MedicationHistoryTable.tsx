'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@cloudscape-design/components'
import PaginatedTable from 'components/common/PaginatedTable'

interface MedicationRecord {
  id: string
  name: string
  amount: number
  takenAt: string
  hasNote?: boolean
}

interface MedicationHistoryTableProps {
  items: MedicationRecord[]
  headerActions?: React.ReactNode
  loading?: boolean
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function MedicationHistoryTable({
  items,
  headerActions,
  loading,
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  onPageSizeChange,
}: MedicationHistoryTableProps) {
  const router = useRouter()

  return (
    <PaginatedTable
      title="履歴一覧"
      headerActions={headerActions}
      columnDefinitions={[
        {
          id: 'name',
          header: '薬名',
          cell: (item) => (
            <span>
              {item.name || '-'}
              {item.hasNote && (
                <>
                  {' '}
                  <Icon name="file" size="small" variant="subtle" />
                </>
              )}
            </span>
          ),
        },
        {
          id: 'amount',
          header: '服薬量(mg)',
          cell: (item) => `${item.amount}mg`,
        },
        {
          id: 'takenAt',
          header: '服薬日時',
          cell: (item) => item.takenAt,
          sortingField: 'takenAt',
        },
      ]}
      items={items}
      trackBy="id"
      loading={loading}
      empty="服薬履歴がありません"
      currentPage={currentPage}
      lastPage={lastPage}
      perPage={perPage}
      total={total}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(item) => router.push(`/medication/history/${item.id}`)}
    />
  )
}
