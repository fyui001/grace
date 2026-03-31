import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { medicationRepository } from 'repository/medicationRepository'
import AppShell from 'components/layout/AppShell'
import DashboardPage from 'components/page-component/DashboardPage'
import { getServerUser } from 'libs/server/getServerUser'

export default async function PageDashboard() {
  const user = await getServerUser()
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  const data = await medicationRepository.getMedicationHistories(
    apiClient,
    1,
    1000,
  )

  const histories = (data?.data ?? []).map((h) => ({
    id: h.id,
    drugName: h.drugName ?? '',
    amount: h.amount,
    createdAt: h.createdAt ?? '',
  }))

  return (
    <AppShell user={user ?? undefined}>
      <DashboardPage
        histories={histories}
        discordLinked={!!user?.discordUserId}
      />
    </AppShell>
  )
}
