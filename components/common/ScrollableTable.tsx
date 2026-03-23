import styled from '@emotion/styled'
import { type ReactNode } from 'react'

const ScrollContainer = styled.div<{ maxHeight: string }>`
  max-height: ${({ maxHeight }) => maxHeight};
  overflow-y: auto;
`

interface ScrollableTableProps {
  maxHeight?: string
  children: ReactNode
}

export default function ScrollableTable({
  maxHeight = '500px',
  children,
}: ScrollableTableProps) {
  return <ScrollContainer maxHeight={maxHeight}>{children}</ScrollContainer>
}
