import type { Meta, StoryObj } from '@storybook/react'
import MedicationHistoryTable from '../../components/medication/MedicationHistoryTable'

const meta = {
  title: 'Components/MedicationHistoryTable',
  component: MedicationHistoryTable,
  parameters: {
    layout: 'padded',
    nextjs: {
      navigation: {
        pathname: '/medication/history',
      },
    },
  },
} satisfies Meta<typeof MedicationHistoryTable>

export default meta
type Story = StoryObj<typeof meta>

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(2026, 2, 15)
    date.setDate(date.getDate() - i)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return {
      id: String(i + 1),
      name: i % 3 === 0 ? 'レボチロキシン' : 'ロキソプロフェン',
      amount: i % 3 === 0 ? 1 : 2,
      takenAt: `${yyyy}-${mm}-${dd} 07:${String(30 - (i % 15)).padStart(2, '0')}`,
      hasNote: i % 4 === 0,
    }
  })

const paginationArgs = {
  currentPage: 1,
  lastPage: 4,
  perPage: 25,
  total: 80,
  onPageChange: () => {},
  onPageSizeChange: () => {},
}

export const Default: Story = {
  args: {
    items: generateItems(25),
    ...paginationArgs,
  },
}

export const ManyPages: Story = {
  args: {
    items: generateItems(25),
    currentPage: 2,
    lastPage: 4,
    perPage: 25,
    total: 80,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    items: [],
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    total: 0,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
}

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    total: 0,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
}
