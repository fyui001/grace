import { Container, Header, Toggle } from '@cloudscape-design/components'

interface DisplaySettingsProps {
  mode: 'light' | 'dark'
  onToggle: () => void
}

export default function DisplaySettings({
  mode,
  onToggle,
}: DisplaySettingsProps) {
  return (
    <Container header={<Header variant="h2">表示設定</Header>}>
      <Toggle checked={mode === 'dark'} onChange={onToggle}>
        ダークモード
      </Toggle>
    </Container>
  )
}
