'use client'

import { useRouter } from 'next/navigation'
import { Icon, Link } from '@cloudscape-design/components'
import PaginatedTable from 'components/common/PaginatedTable'

interface Drug {
  id: string
  name: string
  url: string
  hasNote?: boolean
}

interface DrugListTableProps {
  items: Drug[]
  headerActions?: React.ReactNode
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function DrugListTable({
  items,
  headerActions,
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
          id: 'url',
          header: 'リンク',
          cell: (item) =>
            item.url ? (
              <Link href={item.url} external>
                詳細
              </Link>
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
