import type { Meta, StoryObj } from '@storybook/react'
import DrugDetailPage from '../../components/page-component/DrugDetailPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/DrugDetail',
  component: DrugDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/drugs/1',
      },
    },
  },
} satisfies Meta<typeof DrugDetailPage>

export default meta
type Story = StoryObj<typeof meta>

const sampleDrug = {
  id: 1,
  name: 'レボチロキシン',
  url: 'https://example.com/drug/levothyroxine',
  note: JSON.stringify([
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '甲状腺ホルモン補充薬。朝食前に服用。' }],
    },
    {
      type: 'bulletListItem',
      content: [{ type: 'text', text: '空腹時に服用' }],
    },
    {
      type: 'bulletListItem',
      content: [{ type: 'text', text: 'カルシウム剤との併用注意' }],
    },
  ]),
}

export const Default: Story = {
  args: {
    drug: sampleDrug,
  },
}

export const WithAppShell: Story = {
  args: {
    drug: sampleDrug,
  },
  decorators: [withAppShell],
}

export const NoNote: Story = {
  args: {
    drug: {
      id: 2,
      name: 'ロキソプロフェン',
      url: '',
      note: null,
    },
  },
}

export const LongUrl: Story = {
  args: {
    drug: {
      ...sampleDrug,
      url: 'https://example.com/very/long/path/to/drug/information/page/that/should/wrap/properly/without/overflowing/the/container/levothyroxine?param=value&another=longvalue',
    },
  },
}
