'use client'

import PaginatedTable from 'components/common/PaginatedTable'

interface MedicationRecord {
  id: string
  name: string
  amount: number
  takenAt: string
}

interface MedicationHistoryTableProps {
  items: MedicationRecord[]
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
  loading,
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  onPageSizeChange,
}: MedicationHistoryTableProps) {
  return (
    <PaginatedTable
      title="履歴一覧"
      maxHeight="calc(100vh - 250px)"
      columnDefinitions={[
        { id: 'name', header: '薬名', cell: (item) => item.name },
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
    />
  )
}
