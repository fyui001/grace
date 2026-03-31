'use client'

import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
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
  const router = useRouter()

  return (
    <PaginatedTable
      title="履歴一覧"
      columnDefinitions={[
        {
          id: 'name',
          header: '薬名',
          cell: (item) => (
            <span className="inline-flex items-center gap-1">
              {item.name || '-'}
              {item.hasNote && (
                <FileText className="size-3.5 text-muted-foreground" />
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
