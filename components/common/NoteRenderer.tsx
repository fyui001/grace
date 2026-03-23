'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import type { Block } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useTheme } from 'components/theme/ThemeProvider'
import { cloudscapeBlockNoteTheme } from './blocknoteTheme'

function parseContent(note: string): Block[] | undefined {
  try {
    const parsed = JSON.parse(note)
    if (Array.isArray(parsed)) return parsed as Block[]
    return undefined
  } catch {
    return undefined
  }
}

interface NoteRendererProps {
  note: string
}

export default function NoteRenderer({ note }: NoteRendererProps) {
  const content = parseContent(note)
  const { mode } = useTheme()

  const editor = useCreateBlockNote({
    initialContent: content,
  })

  if (!content) {
    return <p>{note}</p>
  }

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={cloudscapeBlockNoteTheme[mode]}
    />
  )
}
