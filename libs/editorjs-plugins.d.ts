declare module '@editorjs/table' {
  import type { BlockToolConstructable } from '@editorjs/editorjs'
  const Table: BlockToolConstructable
  export default Table
}

declare module '@editorjs/delimiter' {
  import type { BlockToolConstructable } from '@editorjs/editorjs'
  const Delimiter: BlockToolConstructable
  export default Delimiter
}

declare module '@editorjs/inline-code' {
  import type { InlineToolConstructable } from '@editorjs/editorjs'
  const InlineCode: InlineToolConstructable
  export default InlineCode
}

declare module '@editorjs/marker' {
  import type { InlineToolConstructable } from '@editorjs/editorjs'
  const Marker: InlineToolConstructable
  export default Marker
}

declare module '@editorjs/underline' {
  import type { InlineToolConstructable } from '@editorjs/editorjs'
  const Underline: InlineToolConstructable
  export default Underline
}
