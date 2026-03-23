import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { drugRepository } from 'repository/drugRepository'
import AppShell from 'components/layout/AppShell'
import DrugListPage from 'components/page-component/DrugListPage'
import { getServerUser } from 'libs/server/getServerUser'

const DEFAULT_PAGE_SIZE = 25

export default async function PageDrugs({
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

  const pageSizeCookie = cookieStore.get('grace-drug-list-page-size')
  const perPage = Number(pageSizeCookie?.value) || DEFAULT_PAGE_SIZE

  const user = await getServerUser()
  const apiClient = createServerApiClient({ cookie })
  const data = await drugRepository.getDrugs(apiClient, page, perPage)

  const items = (data?.data ?? []).map((h) => ({
    id: String(h.id),
    name: h.name ?? '',
    url: h.url ?? '',
    hasNote: !!h.note,
  }))

  return (
    <AppShell user={user ?? undefined}>
      <DrugListPage
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
