'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from 'components/ui/button'
import MedicationHistoryTable from 'components/medication/MedicationHistoryTable'
import CreateMedicationHistoryModal from 'components/medication/CreateMedicationHistoryModal'
import DiscordLinkPrompt from 'components/common/DiscordLinkPrompt'

const PAGE_SIZE_COOKIE = 'grace-medication-history-page-size'

function setPageSizeCookie(size: number) {
  document.cookie = `${PAGE_SIZE_COOKIE}=${size}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

interface MedicationRecord {
  id: string
  name: string
  amount: number
  takenAt: string
  hasNote?: boolean
}

interface Drug {
  id: string
  name: string
}

interface MedicationHistoryPageProps {
  items: MedicationRecord[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  discordLinked?: boolean
  drugs?: Drug[]
}

const MOCK_ITEMS: MedicationRecord[] = [
  { id: '1', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-23 07:30' },
  {
    id: '2',
    name: 'ロキソプロフェン',
    amount: 60,
    takenAt: '2026-03-23 08:00',
  },
  { id: '3', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-22 07:25' },
  { id: '4', name: 'アムロジピン', amount: 5, takenAt: '2026-03-22 08:00' },
  {
    id: '5',
    name: 'ロキソプロフェン',
    amount: 60,
    takenAt: '2026-03-21 12:00',
  },
]

export default function MedicationHistoryPage({
  items,
  currentPage,
  lastPage,
  perPage,
  total,
  discordLinked,
  drugs = [],
}: MedicationHistoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [modalVisible, setModalVisible] = useState(false)

  const navigateWithParams = useCallback(
    (page: number, pageSize?: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(page))
      if (pageSize !== undefined) {
        params.set('per_page', String(pageSize))
      }
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const handlePageChange = useCallback(
    (page: number) => navigateWithParams(page),
    [navigateWithParams],
  )

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setPageSizeCookie(pageSize)
      navigateWithParams(1, pageSize)
    },
    [navigateWithParams],
  )

  const handleCreated = useCallback(() => {
    setModalVisible(false)
    router.refresh()
  }, [router])

  if (discordLinked === false) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">服薬履歴</h1>
        <DiscordLinkPrompt>
          <MedicationHistoryTable
            items={MOCK_ITEMS}
            currentPage={1}
            lastPage={3}
            perPage={25}
            total={62}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </DiscordLinkPrompt>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">服薬履歴</h1>
        {drugs.length > 0 && (
          <Button onClick={() => setModalVisible(true)}>服薬を記録</Button>
        )}
      </div>
      <MedicationHistoryTable
        items={items}
        currentPage={currentPage}
        lastPage={lastPage}
        perPage={perPage}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <CreateMedicationHistoryModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onCreated={handleCreated}
        drugs={drugs}
      />
    </div>
  )
}
