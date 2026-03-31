import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { medicationRepository } from 'repository/medicationRepository'
import AppShell from 'components/layout/AppShell'
import MedicationHistoryEditPage from 'components/page-component/MedicationHistoryEditPage'
import { getServerUser } from 'libs/server/getServerUser'
import { notFound } from 'next/navigation'

export default async function PageMedicationHistoryEdit({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getServerUser()
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  const history = await medicationRepository.getMedicationHistory(
    apiClient,
    Number(id),
  )

  if (!history) {
    notFound()
  }

  return (
    <AppShell
      user={user ?? undefined}
      breadcrumbs={[
        { text: '服薬履歴', href: '/medication/history' },
        {
          text: `${history.drugName ?? '履歴詳細'}`,
          href: `/medication/history/${id}`,
        },
        { text: '編集', href: `/medication/history/${id}/edit` },
      ]}
    >
      <MedicationHistoryEditPage
        history={{
          id: history.id,
          drugName: history.drugName ?? '',
          amount: history.amount,
          note: history.note ?? null,
          createdAt: history.createdAt ?? '',
        }}
      />
    </AppShell>
  )
}
