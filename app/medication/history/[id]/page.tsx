import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { medicationRepository } from 'repository/medicationRepository'
import AppShell from 'components/layout/AppShell'
import MedicationHistoryDetailPage from 'components/page-component/MedicationHistoryDetailPage'
import { getServerUser } from 'libs/server/getServerUser'
import { notFound } from 'next/navigation'

export default async function PageMedicationHistoryDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getServerUser()
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

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
      ]}
    >
      <MedicationHistoryDetailPage
        history={{
          id: history.id,
          drugId: history.drugId,
          drugName: history.drugName ?? '',
          drugUrl: history.drugUrl ?? '',
          amount: history.amount,
          note: history.note ?? null,
          createdAt: history.createdAt ?? '',
          updatedAt: history.updatedAt ?? '',
        }}
      />
    </AppShell>
  )
}
