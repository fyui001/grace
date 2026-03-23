'use client'

import { useRef, useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import type { Block } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useTheme } from 'components/theme/ThemeProvider'
import { cloudscapeBlockNoteTheme } from './blocknoteTheme'

const EditorWrapper = styled.div`
  min-height: 200px;
`

function parseInitialContent(data: string | null): Block[] | undefined {
  if (!data) return undefined
  try {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) return parsed as Block[]
    return undefined
  } catch {
    return undefined
  }
}

interface NoteEditorProps {
  data: string | null
  onChange: (json: string) => void
}

export default function NoteEditor({ data, onChange }: NoteEditorProps) {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  const { mode } = useTheme()

  const editor = useCreateBlockNote({
    initialContent: parseInitialContent(data),
  })

  const handleChange = useCallback(() => {
    onChangeRef.current(JSON.stringify(editor.document))
  }, [editor])

  return (
    <EditorWrapper>
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme={cloudscapeBlockNoteTheme[mode]}
      />
    </EditorWrapper>
  )
}
