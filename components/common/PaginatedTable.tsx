'use client'

import {
  Header,
  Pagination,
  Select,
  SpaceBetween,
  Table,
  type TableProps,
} from '@cloudscape-design/components'
import ScrollableTable from 'components/common/ScrollableTable'

const PAGE_SIZE_OPTIONS = [
  { value: '25', label: '25件' },
  { value: '50', label: '50件' },
  { value: '100', label: '100件' },
  { value: '200', label: '200件' },
]

interface PaginatedTableProps<T> {
  title: string
  columnDefinitions: TableProps<T>['columnDefinitions']
  items: T[]
  trackBy: TableProps<T>['trackBy']
  loading?: boolean
  loadingText?: string
  empty?: string
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRowClick?: (item: T) => void
  maxHeight?: string
}

export default function PaginatedTable<T>({
  title,
  columnDefinitions,
  items,
  trackBy,
  loading,
  loadingText = '読み込み中',
  empty,
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  maxHeight,
}: PaginatedTableProps<T>) {
  return (
    <ScrollableTable
      maxHeight={maxHeight}
      clickableRows={!!onRowClick}
    >
      <Table
        variant="container"
        stickyHeader
        header={
          <Header variant="h2" counter={`(${total})`}>
            {title}
          </Header>
        }
        loading={loading}
        loadingText={loadingText}
        columnDefinitions={columnDefinitions}
        items={items}
        trackBy={trackBy}
        stripedRows
        sortingDisabled
        onRowClick={
          onRowClick
            ? ({ detail }) => onRowClick(detail.item)
            : undefined
        }
        empty={empty}
        pagination={
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Select
              selectedOption={
                PAGE_SIZE_OPTIONS.find((o) => o.value === String(perPage)) ??
                PAGE_SIZE_OPTIONS[0]
              }
              options={PAGE_SIZE_OPTIONS}
              onChange={({ detail }) =>
                onPageSizeChange(Number(detail.selectedOption.value))
              }
            />
            <Pagination
              currentPageIndex={currentPage}
              pagesCount={lastPage}
              onChange={({ detail }) => onPageChange(detail.currentPageIndex)}
            />
          </SpaceBetween>
        }
      />
    </ScrollableTable>
  )
}
