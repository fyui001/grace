import type { Meta, StoryObj } from '@storybook/react'
import DrugListTable from '../../components/medication/DrugListTable'

const meta = {
  title: 'Components/DrugListTable',
  component: DrugListTable,
  parameters: {
    layout: 'padded',
    nextjs: {
      navigation: {
        pathname: '/medication/drugs',
      },
    },
  },
} satisfies Meta<typeof DrugListTable>

export default meta
type Story = StoryObj<typeof meta>

const paginationArgs = {
  currentPage: 1,
  lastPage: 1,
  perPage: 25,
  total: 3,
  onPageChange: () => {},
  onPageSizeChange: () => {},
}

export const Default: Story = {
  args: {
    items: [
      {
        id: '1',
        name: 'レボチロキシン',
        url: 'https://example.com/drug/1',
        hasNote: true,
      },
      {
        id: '2',
        name: 'ロキソプロフェン',
        url: 'https://example.com/drug/2',
        hasNote: false,
      },
      { id: '3', name: 'アムロジピン', url: '', hasNote: true },
    ],
    ...paginationArgs,
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
