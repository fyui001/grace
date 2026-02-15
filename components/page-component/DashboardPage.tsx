'use client'

import {
  Container,
  ContentLayout,
  Header,
} from '@cloudscape-design/components'

export default function DashboardPage() {
  return (
    <ContentLayout header={<Header variant="h1">服薬履歴</Header>}>
      <Container>服薬履歴がここに表示されます。</Container>
    </ContentLayout>
  )
}
