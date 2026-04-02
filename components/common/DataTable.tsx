'use client'

import { type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table'

export interface ColumnDefinition<T> {
  id: string
  header: ReactNode
  cell: (item: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columnDefinitions: ColumnDefinition<T>[]
  items: T[]
  trackBy?: keyof T | ((item: T) => string)
  loading?: boolean
  loadingText?: string
  empty?: ReactNode
  striped?: boolean
  onRowClick?: (item: T) => void
  maxHeight?: string
}

export default function DataTable<T>({
  columnDefinitions,
  items,
  trackBy,
  loading,
  loadingText = '読み込み中...',
  empty,
  striped = false,
  onRowClick,
  maxHeight,
}: DataTableProps<T>) {
  const getKey = (item: T, index: number): string => {
    if (!trackBy) return String(index)
    if (typeof trackBy === 'function') return trackBy(item)
    return String(item[trackBy])
  }

  const table = (
    <Table>
      {columnDefinitions.some((col) => col.width) && (
        <colgroup>
          {columnDefinitions.map((col) => (
            <col
              key={col.id}
              style={col.width ? { width: col.width } : undefined}
            />
          ))}
        </colgroup>
      )}
      <TableHeader>
        <TableRow>
          {columnDefinitions.map((col) => (
            <TableHead key={col.id}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={columnDefinitions.length}
              className="text-center py-8 text-muted-foreground"
            >
              {loadingText}
            </TableCell>
          </TableRow>
        ) : items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columnDefinitions.length}
              className="text-center py-8 text-muted-foreground"
            >
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => (
            <TableRow
              key={getKey(item, index)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${striped && index % 2 === 1 ? 'bg-muted/30' : ''}`}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'link' : undefined}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(item)
                      }
                    }
                  : undefined
              }
            >
              {columnDefinitions.map((col) => (
                <TableCell key={col.id}>{col.cell(item)}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  if (maxHeight) {
    return (
      <div
        className="overflow-auto [&_[data-slot=table-container]]:overflow-visible"
        style={{ maxHeight }}
      >
        {table}
      </div>
    )
  }

  return table
}
