'use client'

import { useMemo, useState } from 'react'
import {
  Container,
  Header,
  Select,
  SpaceBetween,
  Table,
  Tabs,
} from '@cloudscape-design/components'
import ScrollableTable from 'components/common/ScrollableTable'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface MedicationHistory {
  id: number
  drugName: string
  amount: number
  createdAt: string
}

interface DashboardPageProps {
  histories: MedicationHistory[]
}

const COLORS = [
  '#0073bb',
  '#dd6b20',
  '#2ea597',
  '#9469d6',
  '#df3312',
  '#89bdee',
]

const PERIOD_OPTIONS = [
  { value: '7', label: '1週間' },
  { value: '14', label: '2週間' },
  { value: '30', label: '1ヶ月' },
  { value: '90', label: '3ヶ月' },
  { value: 'all', label: '全期間' },
]

function filterByPeriod(histories: MedicationHistory[], days: string) {
  if (days === 'all') return histories
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - Number(days))
  return histories.filter((h) => new Date(h.createdAt) >= cutoff)
}

// --- 日別服薬回数 ---

function buildDailyCount(histories: MedicationHistory[]) {
  const map = new Map<string, number>()
  for (const h of histories) {
    const date = h.createdAt.substring(0, 10)
    map.set(date, (map.get(date) ?? 0) + 1)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.substring(5), count }))
}

// --- 日別服薬量 (薬別) ---

function buildDailyAmountByDrug(histories: MedicationHistory[]) {
  const drugs = [...new Set(histories.map((h) => h.drugName))]
  const map = new Map<string, Record<string, number>>()
  for (const h of histories) {
    const date = h.createdAt.substring(0, 10)
    if (!map.has(date)) map.set(date, {})
    const day = map.get(date)!
    day[h.drugName] = (day[h.drugName] ?? 0) + h.amount
  }
  return {
    data: [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amounts]) => ({ date: date.substring(5), ...amounts })),
    drugs,
  }
}

// --- 薬別割合 ---

function buildDrugBreakdown(histories: MedicationHistory[]) {
  const map = new Map<string, number>()
  for (const h of histories) {
    map.set(h.drugName, (map.get(h.drugName) ?? 0) + 1)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }))
}

// --- 時間帯別分布 ---

function buildHourlyDistribution(histories: MedicationHistory[]) {
  const map = new Map<number, number>()
  for (const h of histories) {
    const match = h.createdAt.match(/T(\d{2})/)
    if (match) {
      const hour = Number(match[1])
      map.set(hour, (map.get(hour) ?? 0) + 1)
    }
  }
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}時`,
    count: map.get(i) ?? 0,
  }))
}

// --- 週別服薬量 (薬別) ---

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function fmtShort(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function buildWeeklyAmountByDrug(histories: MedicationHistory[]) {
  const filtered = histories.filter((h) => h.amount > 0)
  const drugs = [...new Set(filtered.map((h) => h.drugName))]
  const map = new Map<
    number,
    { label: string; amounts: Record<string, number> }
  >()

  for (const h of filtered) {
    const monday = getMonday(new Date(h.createdAt))
    const key = monday.getTime()
    if (!map.has(key)) {
      const sunday = new Date(monday)
      sunday.setDate(sunday.getDate() + 6)
      map.set(key, {
        label: `${fmtShort(monday)}~${fmtShort(sunday)}`,
        amounts: {},
      })
    }
    const week = map.get(key)!
    week.amounts[h.drugName] = (week.amounts[h.drugName] ?? 0) + h.amount
  }

  return {
    data: [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, { label, amounts }]) => {
        const row: Record<string, string | number> = { week: label }
        for (const drug of drugs) {
          row[drug] = amounts[drug] ?? 0
        }
        return row
      }),
    drugs,
  }
}

// --- コンポーネント ---

function PeriodSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select
      selectedOption={
        PERIOD_OPTIONS.find((o) => o.value === value) ?? PERIOD_OPTIONS[2]
      }
      options={PERIOD_OPTIONS}
      onChange={({ detail }) => onChange(detail.selectedOption.value ?? '30')}
    />
  )
}

function DailyCountChart({
  histories,
}: {
  histories: MedicationHistory[]
}) {
  const data = useMemo(() => buildDailyCount(histories), [histories])
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" name="服薬回数" fill="#0073bb" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function DailyAmountChart({
  histories,
}: {
  histories: MedicationHistory[]
}) {
  const { data, drugs } = useMemo(
    () => buildDailyAmountByDrug(histories),
    [histories],
  )
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        {drugs.map((drug, i) => (
          <Bar
            key={drug}
            dataKey={drug}
            name={`${drug} (mg)`}
            fill={COLORS[i % COLORS.length]}
            stackId="amount"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

function DrugBreakdownChart({
  histories,
}: {
  histories: MedicationHistory[]
}) {
  const data = useMemo(() => buildDrugBreakdown(histories), [histories])
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}回`} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function HourlyChart({ histories }: { histories: MedicationHistory[] }) {
  const data = useMemo(
    () => buildHourlyDistribution(histories),
    [histories],
  )
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" fontSize={12} interval={2} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" name="回数" fill="#2ea597" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function WeeklyAmountChart({
  histories,
}: {
  histories: MedicationHistory[]
}) {
  const { data, drugs } = useMemo(
    () => buildWeeklyAmountByDrug(histories),
    [histories],
  )
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" fontSize={12} />
        <YAxis />
        <Tooltip formatter={(value) => `${value}mg`} />
        <Legend />
        {drugs.map((drug, i) => (
          <Line
            key={drug}
            type="monotone"
            dataKey={drug}
            name={`${drug} (mg)`}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function RecentHistoryTable({
  histories,
}: {
  histories: MedicationHistory[]
}) {
  const recentItems = histories.map((h) => ({
      id: String(h.id),
      name: h.drugName,
      amount: h.amount,
      takenAt: h.createdAt.replace('T', ' ').substring(0, 16),
    }))

  return (
    <ScrollableTable>
      <Table
        variant="container"
        header={
          <Header variant="h2" counter={`(${recentItems.length})`}>
            直近の服薬履歴
          </Header>
        }
        columnDefinitions={[
          { id: 'name', header: '薬名', cell: (item) => item.name },
          {
            id: 'amount',
            header: '服薬量(mg)',
            cell: (item) => `${item.amount}mg`,
          },
          {
            id: 'takenAt',
            header: '服薬日時',
            cell: (item) => item.takenAt,
          },
        ]}
        items={recentItems}
        trackBy="id"
        stripedRows
        sortingDisabled
        empty="服薬履歴はありません"
      />
    </ScrollableTable>
  )
}

export default function DashboardPage({ histories }: DashboardPageProps) {
  const [period, setPeriod] = useState('30')
  const [activeTab, setActiveTab] = useState('daily-count')

  const filtered = useMemo(
    () => filterByPeriod(histories, period),
    [histories, period],
  )

  return (
    <SpaceBetween size="l">
      <Header variant="h1" actions={<PeriodSelect value={period} onChange={setPeriod} />}>
        ダッシュボード
      </Header>

      <Container
        header={<Header variant="h2">服薬分析</Header>}
      >
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={[
            {
              id: 'daily-count',
              label: '日別回数',
              content: <DailyCountChart histories={filtered} />,
            },
            {
              id: 'daily-amount',
              label: '日別服薬量',
              content: <DailyAmountChart histories={filtered} />,
            },
            {
              id: 'weekly-amount',
              label: '週別服薬量',
              content: <WeeklyAmountChart histories={filtered} />,
            },
            {
              id: 'hourly',
              label: '時間帯別',
              content: <HourlyChart histories={filtered} />,
            },
            {
              id: 'drug-breakdown',
              label: '薬別割合',
              content: <DrugBreakdownChart histories={filtered} />,
            },
          ]}
        />
      </Container>

      <RecentHistoryTable histories={filtered} />
    </SpaceBetween>
  )
}
