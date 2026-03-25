'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@cloudscape-design/components'
import DrugListTable from 'components/medication/DrugListTable'
import CreateDrugModal from 'components/medication/CreateDrugModal'
import DiscordLinkPrompt from 'components/common/DiscordLinkPrompt'
import { setPageSizeCookie } from 'utils/cookies'

const PAGE_SIZE_COOKIE = 'grace-drug-list-page-size'

interface Drug {
  id: string
  name: string
  url: string
  hasNote?: boolean
}

interface DrugListPageProps {
  items: Drug[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  discordLinked?: boolean
}

const MOCK_ITEMS: Drug[] = [
  {
    id: '1',
    name: 'レボチロキシン',
    url: 'https://example.com',
    hasNote: true,
  },
  { id: '2', name: 'ロキソプロフェン', url: '', hasNote: false },
  { id: '3', name: 'アムロジピン', url: '', hasNote: true },
]

export default function DrugListPage({
  items,
  currentPage,
  lastPage,
  perPage,
  total,
  discordLinked,
}: DrugListPageProps) {
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
      setPageSizeCookie(PAGE_SIZE_COOKIE, pageSize)
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
      <DiscordLinkPrompt>
        <DrugListTable
          items={MOCK_ITEMS}
          currentPage={1}
          lastPage={1}
          perPage={25}
          total={3}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </DiscordLinkPrompt>
    )
  }

  return (
    <>
      <DrugListTable
        items={items}
        headerActions={
          <Button variant="primary" onClick={() => setModalVisible(true)}>
            薬を登録
          </Button>
        }
        currentPage={currentPage}
        lastPage={lastPage}
        perPage={perPage}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <CreateDrugModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onCreated={handleCreated}
      />
    </>
  )
}
