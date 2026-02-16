'use client'

import {
  Box,
  ColumnLayout,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components'

const medicationHistory = [
  { date: '2026-02-15', name: 'レボチロキシン', time: '07:30', status: 'completed' },
  { date: '2026-02-14', name: 'レボチロキシン', time: '07:25', status: 'completed' },
  { date: '2026-02-13', name: 'レボチロキシン', time: '08:10', status: 'completed' },
  { date: '2026-02-12', name: 'レボチロキシン', time: '07:45', status: 'completed' },
  { date: '2026-02-11', name: 'レボチロキシン', time: '—', status: 'missed' },
  { date: '2026-02-10', name: 'レボチロキシン', time: '07:30', status: 'completed' },
  { date: '2026-02-09', name: 'レボチロキシン', time: '09:00', status: 'completed' },
] as const

export default function DashboardPage() {
  return (
    <ContentLayout header={<Header variant="h1">服薬履歴</Header>}>
      <SpaceBetween size="l">
        <ColumnLayout columns={3}>
          <Container header={<Header variant="h2">今日の服薬</Header>}>
            <Box>
              <StatusIndicator type="success">完了</StatusIndicator>
            </Box>
          </Container>
          <Container header={<Header variant="h2">連続服薬日数</Header>}>
            <Box fontSize="display-l" fontWeight="bold">
              4日
            </Box>
          </Container>
          <Container header={<Header variant="h2">今月の服薬率</Header>}>
            <Box fontSize="display-l" fontWeight="bold">
              93%
            </Box>
          </Container>
        </ColumnLayout>

        <Table
          header={<Header variant="h2">服薬履歴</Header>}
          columnDefinitions={[
            { id: 'date', header: '日付', cell: (item) => item.date },
            { id: 'name', header: '薬名', cell: (item) => item.name },
            { id: 'time', header: '時間', cell: (item) => item.time },
            {
              id: 'status',
              header: 'ステータス',
              cell: (item) =>
                item.status === 'completed' ? (
                  <StatusIndicator type="success">服薬済み</StatusIndicator>
                ) : (
                  <StatusIndicator type="error">未服薬</StatusIndicator>
                ),
            },
          ]}
          items={[...medicationHistory]}
        />
      </SpaceBetween>
    </ContentLayout>
  )
}
