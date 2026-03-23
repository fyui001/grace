import styled from '@emotion/styled'
import { type ReactNode } from 'react'

const ScrollContainer = styled.div<{
  $maxHeight: string
  $clickableRows: boolean
}>`
  max-height: ${({ $maxHeight }) => $maxHeight};
  overflow-y: auto;

  ${({ $clickableRows }) =>
    $clickableRows &&
    `
    tr[class*='row'] {
      cursor: pointer;
      &:hover td {
        background-color: var(
          --color-background-dropdown-item-hover,
          rgba(255, 255, 255, 0.1)
        );
      }
    }
  `}
`

interface ScrollableTableProps {
  maxHeight?: string
  clickableRows?: boolean
  children: ReactNode
}

export default function ScrollableTable({
  maxHeight = '500px',
  clickableRows = false,
  children,
}: ScrollableTableProps) {
  return (
    <ScrollContainer
      $maxHeight={maxHeight}
      $clickableRows={clickableRows}
    >
      {children}
    </ScrollContainer>
  )
}
