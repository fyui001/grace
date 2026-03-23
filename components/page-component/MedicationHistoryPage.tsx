'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header, SpaceBetween } from '@cloudscape-design/components'
import MedicationHistoryTable from 'components/medication/MedicationHistoryTable'
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

interface MedicationHistoryPageProps {
  items: MedicationRecord[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  discordLinked?: boolean
}

const MOCK_ITEMS: MedicationRecord[] = [
  { id: '1', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-23 07:30' },
  { id: '2', name: 'ロキソプロフェン', amount: 60, takenAt: '2026-03-23 08:00' },
  { id: '3', name: 'レボチロキシン', amount: 50, takenAt: '2026-03-22 07:25' },
  { id: '4', name: 'アムロジピン', amount: 5, takenAt: '2026-03-22 08:00' },
  { id: '5', name: 'ロキソプロフェン', amount: 60, takenAt: '2026-03-21 12:00' },
]

export default function MedicationHistoryPage({
  items,
  currentPage,
  lastPage,
  perPage,
  total,
  discordLinked,
}: MedicationHistoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      <Header variant="h1">服薬履歴</Header>
      <MedicationHistoryTable
        items={items}
        currentPage={currentPage}
        lastPage={lastPage}
        perPage={perPage}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </SpaceBetween>
  )
}
