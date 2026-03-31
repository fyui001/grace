'use client'

import { Button } from 'components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import DataTable, { type ColumnDefinition } from 'components/common/DataTable'

const PAGE_SIZE_OPTIONS = [
  { value: '25', label: '25件' },
  { value: '50', label: '50件' },
  { value: '100', label: '100件' },
  { value: '200', label: '200件' },
]

interface PaginatedTableProps<T> {
  title: string
  columnDefinitions: ColumnDefinition<T>[]
  items: T[]
  trackBy?: keyof T | ((item: T) => string)
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
  loadingText,
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
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>
          {title} ({total})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={String(perPage)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="前のページ"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm px-2">
              {currentPage} / {lastPage}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="次のページ"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="overflow-y-auto"
          style={maxHeight ? { maxHeight } : undefined}
        >
          <DataTable
            columnDefinitions={columnDefinitions}
            items={items}
            trackBy={trackBy}
            loading={loading}
            loadingText={loadingText}
            empty={empty}
            striped
            onRowClick={onRowClick}
          />
        </div>
      </CardContent>
    </Card>
  )
}
