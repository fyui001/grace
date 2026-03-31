import type { Theme } from '@blocknote/mantine'

// Grace アプリのカラー定義（ライト/ダークモード対応）
const lightTheme: Theme = {
  colors: {
    editor: {
      text: '#0f141a', // neutral-950
      background: 'transparent',
    },
    menu: {
      text: '#0f141a',
      background: '#ffffff',
    },
    tooltip: {
      text: '#ffffff',
      background: '#0f141a',
    },
    hovered: {
      text: '#0f141a',
      background: '#f6f6f9', // neutral-150
    },
    selected: {
      text: '#0f141a',
      background: '#ebebf0', // neutral-250
    },
    disabled: {
      text: '#9ba7b6', // neutral-500
      background: '#f6f6f9',
    },
    shadow: 'rgba(0, 0, 0, 0.12)',
    border: '#c6c6cd', // neutral-350
    sideMenu: '#9ba7b6',
  },
  borderRadius: 8,
  fontFamily: '"Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif',
}

const darkTheme: Theme = {
  colors: {
    editor: {
      text: '#c6c6cd', // neutral-350
      background: 'transparent',
    },
    menu: {
      text: '#c6c6cd',
      background: '#161d26', // neutral-850
    },
    tooltip: {
      text: '#0f141a',
      background: '#c6c6cd',
    },
    hovered: {
      text: '#c6c6cd',
      background: '#1a2535',
    },
    selected: {
      text: '#c6c6cd',
      background: '#354150',
    },
    disabled: {
      text: '#5f6b7a',
      background: '#1a2535',
    },
    shadow: 'rgba(0, 0, 0, 0.4)',
    border: '#414d5c',
    sideMenu: '#5f6b7a',
  },
  borderRadius: 8,
  fontFamily: '"Open Sans", "Helvetica Neue", Roboto, Arial, sans-serif',
}

export const blockNoteTheme = {
  light: lightTheme,
  dark: darkTheme,
}
