'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Header, SpaceBetween } from '@cloudscape-design/components'
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
    (page: number) => {
      navigateWithParams(page)
    },
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

  const createButton = drugs.length > 0 && (
    <Button variant="primary" onClick={() => setModalVisible(true)}>
      服薬を記録
    </Button>
  )

  if (discordLinked === false) {
    return (
      <SpaceBetween size="l">
        <Header variant="h1">服薬履歴</Header>
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
      </SpaceBetween>
    )
  }

  return (
    <SpaceBetween size="l">
      <Header variant="h1" actions={createButton}>
        服薬履歴
      </Header>
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
    </SpaceBetween>
  )
}
