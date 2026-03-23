'use client'

import { useEffect, useRef, useCallback } from 'react'
import styled from '@emotion/styled'
import type EditorJS from '@editorjs/editorjs'
import type { OutputData } from '@editorjs/editorjs'

const EditorHolder = styled.div`
  border: 1px solid var(--color-border-input-default, #545b64);
  border-radius: 8px;
  padding: 8px 0;
  min-height: 300px;
  position: relative;

  .ce-block__content,
  .ce-toolbar__content {
    max-width: calc(100% - 80px);
  }

  .codex-editor__redactor {
    padding-bottom: 100px !important;
  }

  .ce-block__content {
    padding: 0 16px;
  }

  /* スラッシュメニュー */
  .slash-menu {
    position: absolute;
    z-index: 10;
    background: var(--color-background-container-content, #fff);
    border: 1px solid var(--color-border-input-default, #545b64);
    border-radius: 8px;
    padding: 4px 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 200px;
  }

  .slash-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    color: var(--color-text-body-default, #000716);

    &:hover,
    &.slash-menu__item--active {
      background: var(
        --color-background-dropdown-item-hover,
        rgba(0, 0, 0, 0.05)
      );
    }
  }

  .slash-menu__item-shortcut {
    margin-left: auto;
    font-size: 12px;
    color: var(--color-text-body-secondary, #5f6b7a);
  }
`

const MARKDOWN_SHORTCUTS: {
  pattern: RegExp
  type: string
  data: (match: RegExpMatchArray) => Record<string, unknown>
}[] = [
  {
    pattern: /^###\s$/,
    type: 'header',
    data: () => ({ text: '', level: 4 }),
  },
  {
    pattern: /^##\s$/,
    type: 'header',
    data: () => ({ text: '', level: 3 }),
  },
  {
    pattern: /^#\s$/,
    type: 'header',
    data: () => ({ text: '', level: 2 }),
  },
  {
    pattern: /^[-*]\s$/,
    type: 'list',
    data: () => ({ style: 'unordered', items: [''] }),
  },
  {
    pattern: /^1[.)]\s$/,
    type: 'list',
    data: () => ({ style: 'ordered', items: [''] }),
  },
  {
    pattern: /^>\s$/,
    type: 'quote',
    data: () => ({ text: '', caption: '' }),
  },
  {
    pattern: /^```$/,
    type: 'code',
    data: () => ({ code: '' }),
  },
  {
    pattern: /^---$/,
    type: 'delimiter',
    data: () => ({}),
  },
]

const SLASH_MENU_ITEMS = [
  { label: '見出し H2', type: 'header', data: { text: '', level: 2 }, shortcut: '#' },
  { label: '見出し H3', type: 'header', data: { text: '', level: 3 }, shortcut: '##' },
  { label: '見出し H4', type: 'header', data: { text: '', level: 4 }, shortcut: '###' },
  { label: '箇条書きリスト', type: 'list', data: { style: 'unordered', items: [''] }, shortcut: '-' },
  { label: '番号付きリスト', type: 'list', data: { style: 'ordered', items: [''] }, shortcut: '1.' },
  { label: '引用', type: 'quote', data: { text: '', caption: '' }, shortcut: '>' },
  { label: 'コードブロック', type: 'code', data: { code: '' }, shortcut: '```' },
  { label: 'テーブル', type: 'table', data: { content: [['', ''], ['', '']] } },
  { label: '区切り線', type: 'delimiter', data: {}, shortcut: '---' },
]

function createSlashMenu(editor: EditorJS, holder: HTMLElement) {
  let menuEl: HTMLDivElement | null = null
  let activeIndex = 0
  let filtered = SLASH_MENU_ITEMS
  let query = ''

  function close() {
    menuEl?.remove()
    menuEl = null
    query = ''
    activeIndex = 0
    filtered = SLASH_MENU_ITEMS
  }

  function render(rect: DOMRect) {
    if (!menuEl) {
      menuEl = document.createElement('div')
      menuEl.className = 'slash-menu'
      holder.appendChild(menuEl)
    }
    const holderRect = holder.getBoundingClientRect()
    menuEl.style.top = `${rect.bottom - holderRect.top + 4}px`
    menuEl.style.left = `${rect.left - holderRect.left}px`
    menuEl.innerHTML = ''
    filtered.forEach((item, i) => {
      const row = document.createElement('div')
      row.className =
        'slash-menu__item' + (i === activeIndex ? ' slash-menu__item--active' : '')
      row.innerHTML =
        `<span>${item.label}</span>` +
        (item.shortcut
          ? `<span class="slash-menu__item-shortcut">${item.shortcut}</span>`
          : '')
      row.addEventListener('mousedown', (e) => {
        e.preventDefault()
        select(i)
      })
      row.addEventListener('mouseenter', () => {
        activeIndex = i
        render(rect)
      })
      menuEl!.appendChild(row)
    })
  }

  function select(index: number) {
    const item = filtered[index]
    if (!item) return
    const blockIndex = editor.blocks.getCurrentBlockIndex()
    if (blockIndex < 0) return
    editor.blocks.delete(blockIndex)
    editor.blocks.insert(item.type, { ...item.data }, undefined, blockIndex, true)
    editor.caret.setToBlock(blockIndex, 'end')
    close()
  }

  function getCaretRect(): DOMRect | null {
    const sel = document.getSelection()
    if (!sel?.rangeCount) return null
    const range = sel.getRangeAt(0)
    const rects = range.getClientRects()
    if (rects.length > 0) return rects[0]
    // 空行の場合は親要素の位置を使う
    const parent = range.startContainer.parentElement
    return parent?.getBoundingClientRect() ?? null
  }

  holder.addEventListener('input', () => {
    const sel = document.getSelection()
    if (!sel?.focusNode) return
    const node =
      sel.focusNode.nodeType === Node.TEXT_NODE
        ? sel.focusNode.parentElement
        : (sel.focusNode as HTMLElement)
    const editable = node?.closest('[contenteditable]')
    if (!editable) return
    const text = editable.textContent ?? ''

    const currentIndex = editor.blocks.getCurrentBlockIndex()
    if (currentIndex < 0) return
    const block = editor.blocks.getBlockByIndex(currentIndex)
    if (!block || block.name !== 'paragraph') return

    // スラッシュメニュー
    if (text.startsWith('/')) {
      query = text.slice(1).toLowerCase()
      filtered = query
        ? SLASH_MENU_ITEMS.filter((it) => it.label.toLowerCase().includes(query))
        : SLASH_MENU_ITEMS
      activeIndex = 0
      if (filtered.length > 0) {
        const rect = getCaretRect()
        if (rect) render(rect)
      } else {
        close()
      }
      return
    }

    // スラッシュ消されたら閉じる
    if (menuEl) close()

    // マークダウンショートカット
    for (const shortcut of MARKDOWN_SHORTCUTS) {
      const match = text.match(shortcut.pattern)
      if (match) {
        editor.blocks.delete(currentIndex)
        editor.blocks.insert(
          shortcut.type,
          shortcut.data(match),
          undefined,
          currentIndex,
          true,
        )
        editor.caret.setToBlock(currentIndex, 'end')
        break
      }
    }
  })

  holder.addEventListener('keydown', (e) => {
    if (!menuEl) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex = (activeIndex + 1) % filtered.length
      const rect = getCaretRect()
      if (rect) render(rect)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length
      const rect = getCaretRect()
      if (rect) render(rect)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      select(activeIndex)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }, true)

  // フォーカスが外れたら閉じる
  holder.addEventListener('focusout', () => {
    setTimeout(close, 150)
  })
}

interface EditorJsEditorProps {
  data: OutputData | null
  onChange: (data: OutputData) => void
  placeholder?: string
}

export default function EditorJsEditor({
  data,
  onChange,
  placeholder = '備考を入力...',
}: EditorJsEditorProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const initializingRef = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (initializingRef.current || editorRef.current || !holderRef.current)
      return
    initializingRef.current = true

    const holder = holderRef.current
    let cancelled = false

    ;(async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const List = (await import('@editorjs/list')).default
      const Code = (await import('@editorjs/code')).default
      const Quote = (await import('@editorjs/quote')).default
      const Table = (await import('@editorjs/table')).default
      const Delimiter = (await import('@editorjs/delimiter')).default
      const InlineCode = (await import('@editorjs/inline-code')).default
      const Marker = (await import('@editorjs/marker')).default
      const Underline = (await import('@editorjs/underline')).default

      if (cancelled) {
        initializingRef.current = false
        return
      }

      const editor = new EditorJS({
        holder,
        placeholder,
        data: data ?? undefined,
        tools: {
          header: {
            class: Header as unknown as EditorJS.BlockToolConstructable,
            config: { levels: [2, 3, 4], defaultLevel: 2 },
          },
          list: {
            class: List as unknown as EditorJS.BlockToolConstructable,
          },
          code: Code as unknown as EditorJS.BlockToolConstructable,
          quote: Quote as unknown as EditorJS.BlockToolConstructable,
          table: {
            class: Table as unknown as EditorJS.BlockToolConstructable,
            config: { rows: 2, cols: 3 },
          },
          delimiter: Delimiter as unknown as EditorJS.BlockToolConstructable,
          inlineCode: {
            class:
              InlineCode as unknown as EditorJS.InlineToolConstructable,
          },
          marker: {
            class: Marker as unknown as EditorJS.InlineToolConstructable,
          },
          underline: {
            class:
              Underline as unknown as EditorJS.InlineToolConstructable,
          },
        },
        onChange: async () => {
          const output = await editor.save()
          onChangeRef.current(output)
        },
        onReady: () => {
          if (cancelled) {
            editor.destroy()
            return
          }
          createSlashMenu(editor, holder)
        },
      })

      if (cancelled) {
        editor.destroy()
        initializingRef.current = false
        return
      }

      editorRef.current = editor
    })()

    return () => {
      cancelled = true
      if (editorRef.current?.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
      initializingRef.current = false
      holder.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <EditorHolder ref={holderRef} />
}
