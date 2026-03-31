import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { drugRepository } from 'repository/drugRepository'
import AppShell from 'components/layout/AppShell'
import DrugEditPage from 'components/page-component/DrugEditPage'
import { getServerUser } from 'libs/server/getServerUser'
import { notFound } from 'next/navigation'

export default async function PageDrugEdit({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getServerUser()
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  const drug = await drugRepository.getDrug(apiClient, Number(id))

  if (!drug) {
    notFound()
  }

  return (
    <AppShell
      user={user ?? undefined}
      breadcrumbs={[
        { text: '薬一覧', href: '/medication/drugs' },
        { text: drug.name ?? '薬詳細', href: `/medication/drugs/${id}` },
        { text: '編集', href: `/medication/drugs/${id}/edit` },
      ]}
    >
      <DrugEditPage
        drug={{
          id: drug.id,
          name: drug.name ?? '',
          url: drug.url ?? '',
          note: drug.note ?? null,
        }}
      />
    </AppShell>
  )
}
