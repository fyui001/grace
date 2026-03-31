import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Switch } from 'components/ui/switch'

interface DisplaySettingsProps {
  mode: 'light' | 'dark'
  onToggle: () => void
}

export default function DisplaySettings({
  mode,
  onToggle,
}: DisplaySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>表示設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Switch
            id="dark-mode"
            checked={mode === 'dark'}
            onCheckedChange={onToggle}
          />
          <label
            htmlFor="dark-mode"
            className="text-sm cursor-pointer select-none"
          >
            ダークモード
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
