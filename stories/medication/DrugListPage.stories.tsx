import type { Meta, StoryObj } from '@storybook/react'
import DrugListPage from '../../components/page-component/DrugListPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/DrugList',
  component: DrugListPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/drugs',
      },
    },
  },
} satisfies Meta<typeof DrugListPage>

export default meta
type Story = StoryObj<typeof meta>

const sampleItems = [
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
]

const paginationArgs = {
  currentPage: 1,
  lastPage: 1,
  perPage: 25,
  total: 3,
}

export const Default: Story = {
  args: {
    items: sampleItems,
    ...paginationArgs,
  },
}

export const WithAppShell: Story = {
  args: {
    items: sampleItems,
    ...paginationArgs,
  },
  decorators: [withAppShell],
}
