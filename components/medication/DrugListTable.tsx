'use client'

import { useRouter } from 'next/navigation'
import { FileText, ExternalLink } from 'lucide-react'
import PaginatedTable from 'components/common/PaginatedTable'

interface Drug {
  id: string
  name: string
  url: string
  hasNote?: boolean
}

interface DrugListTableProps {
  items: Drug[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function DrugListTable({
  items,
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  onPageSizeChange,
}: DrugListTableProps) {
  const router = useRouter()

  return (
    <PaginatedTable
      title="薬一覧"
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
          id: 'url',
          header: 'リンク',
          cell: (item) =>
            item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                詳細
                <ExternalLink className="size-3" />
              </a>
            ) : (
              '-'
            ),
        },
      ]}
      items={items}
      trackBy="id"
      empty="薬が登録されていません"
      currentPage={currentPage}
      lastPage={lastPage}
      perPage={perPage}
      total={total}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(item) => router.push(`/medication/drugs/${item.id}`)}
    />
  )
}
