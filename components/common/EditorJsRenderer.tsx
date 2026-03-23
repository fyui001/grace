'use client'

import type { OutputData, OutputBlockData } from '@editorjs/editorjs'

function parseNoteData(note: string): OutputData | null {
  try {
    return JSON.parse(note) as OutputData
  } catch {
    return null
  }
}

function renderBlock(block: OutputBlockData, index: number) {
  switch (block.type) {
    case 'header': {
      const level = block.data.level as number
      if (level === 2) return <h2 key={index}>{block.data.text}</h2>
      if (level === 3) return <h3 key={index}>{block.data.text}</h3>
      if (level === 4) return <h4 key={index}>{block.data.text}</h4>
      return <h2 key={index}>{block.data.text}</h2>
    }
    case 'paragraph':
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
      )
    case 'list': {
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
      return (
        <ListTag key={index}>
          {block.data.items.map((item: string, i: number) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      )
    }
    case 'code':
      return (
        <pre key={index}>
          <code>{block.data.code}</code>
        </pre>
      )
    case 'quote':
      return (
        <blockquote key={index}>
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
          {block.data.caption && (
            <cite dangerouslySetInnerHTML={{ __html: block.data.caption }} />
          )}
        </blockquote>
      )
    case 'delimiter':
      return <hr key={index} />
    case 'table': {
      const rows = block.data.content as string[][]
      return (
        <table key={index}>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    default:
      return <p key={index}>{JSON.stringify(block.data)}</p>
  }
}

interface EditorJsRendererProps {
  note: string
}

export default function EditorJsRenderer({ note }: EditorJsRendererProps) {
  const data = parseNoteData(note)

  if (!data?.blocks?.length) {
    return <p>{note}</p>
  }

  return <div>{data.blocks.map(renderBlock)}</div>
}
