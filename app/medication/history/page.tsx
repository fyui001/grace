import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { medicationRepository } from 'repository/medicationRepository'
import AppShell from 'components/layout/AppShell'
import MedicationHistoryPage from 'components/page-component/MedicationHistoryPage'
import { getServerUser } from 'libs/server/getServerUser'

const DEFAULT_PAGE_SIZE = 25

export default async function PageMedicationHistory({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per_page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const pageSizeCookie = cookieStore.get('grace-medication-history-page-size')
  const perPage = Number(pageSizeCookie?.value) || DEFAULT_PAGE_SIZE

  const user = await getServerUser()
  const apiClient = createServerApiClient({ cookie })
  const data = await medicationRepository.getMedicationHistories(
    apiClient,
    page,
    perPage,
  )

  const items = (data?.data ?? []).map((h) => ({
    id: String(h.id),
    name: h.drugName ?? '',
    amount: h.amount,
    takenAt: (h.createdAt ?? '').replace('T', ' ').substring(0, 16),
    hasNote: !!h.note,
  }))

  return (
    <AppShell user={user ?? undefined}>
      <MedicationHistoryPage
        items={items}
        currentPage={data?.currentPage ?? 1}
        lastPage={data?.lastPage ?? 1}
        perPage={data?.perPage ?? perPage}
        total={data?.total ?? 0}
        discordLinked={!!user?.discordUserId}
      />
    </AppShell>
  )
}
