import styled from '@emotion/styled'
import type { ReactNode } from 'react'

const ScrollContainer = styled.div<{
  $maxHeight: string
  $clickableRows: boolean
}>`
  max-height: ${({ $maxHeight }) => $maxHeight};
  overflow-y: auto;

  ${({ $clickableRows }) =>
    $clickableRows &&
    `
    tbody tr {
      cursor: pointer;
      &:hover td {
        background-color: var(
          --color-background-dropdown-item-hover,
          rgba(255, 255, 255, 0.1)
        ) !important;
      }
    }
  `}
`

interface ScrollableTableProps {
  children: ReactNode
  maxHeight?: string
  clickableRows?: boolean
}

export default function ScrollableTable({
  children,
  maxHeight = '500px',
  clickableRows = false,
}: ScrollableTableProps) {
  return (
    <ScrollContainer $maxHeight={maxHeight} $clickableRows={clickableRows}>
      {children}
    </ScrollContainer>
  )
}
