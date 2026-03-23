import type { Meta, StoryObj } from '@storybook/react'
import DrugEditPage from '../../components/page-component/DrugEditPage'
import { withAppShell } from '../decorators'

const meta = {
  title: 'Pages/DrugEdit',
  component: DrugEditPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/medication/drugs/1/edit',
      },
    },
  },
} satisfies Meta<typeof DrugEditPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    drug: {
      id: 1,
      name: 'レボチロキシン',
      url: 'https://example.com/drug/levothyroxine',
      note: JSON.stringify({
        blocks: [
          {
            type: 'paragraph',
            data: { text: '甲状腺ホルモン補充薬。朝食前に服用。' },
          },
        ],
      }),
    },
  },
}

export const WithAppShell: Story = {
  args: {
    drug: {
      id: 1,
      name: 'レボチロキシン',
      url: 'https://example.com/drug/levothyroxine',
      note: null,
    },
  },
  decorators: [withAppShell],
}

export const NewDrug: Story = {
  args: {
    drug: {
      id: 2,
      name: '',
      url: '',
      note: null,
    },
  },
}
