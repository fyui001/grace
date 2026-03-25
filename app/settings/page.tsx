import AppShell from 'components/layout/AppShell'
import SettingsPage from 'components/page-component/SettingsPage'
import { getServerUser } from 'libs/server/getServerUser'

export default async function PageSettings() {
  const user = await getServerUser()

  return (
    <AppShell user={user ?? undefined} pageTitle="設定" contentType="form">
      <SettingsPage userName={user?.name ?? ''} />
    </AppShell>
  )
}
