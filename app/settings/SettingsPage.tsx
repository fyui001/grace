'use client'

import {
  Container,
  ContentLayout,
  Header,
} from '@cloudscape-design/components'

export default function SettingsPage() {
  return (
    <ContentLayout header={<Header variant="h1">設定</Header>}>
      <Container>設定項目がここに表示されます。</Container>
    </ContentLayout>
  )
}
