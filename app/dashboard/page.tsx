import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { medicationRepository } from 'repository/medicationRepository'
import AppShell from 'components/layout/AppShell'
import DashboardPage from 'components/page-component/DashboardPage'

export default async function PageDashboard() {
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const apiClient = createServerApiClient({ cookie })
  const data = await medicationRepository.getMedicationHistories(
    apiClient,
    1,
    1000,
  )

  const histories = (data?.data ?? []).map((h) => ({
    id: h.id,
    drugName: h.drugName,
    amount: h.amount,
    createdAt: h.createdAt,
  }))

  return (
    <AppShell>
      <DashboardPage histories={histories} />
    </AppShell>
  )
}
