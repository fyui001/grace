import type { ClientType } from './types'

export const drugRepository = {
  async getDrugs(apiClient: ClientType, page?: number, perPage?: number) {
    try {
      const result = await apiClient.GET('/api/drugs', {
        params: { query: { page, per_page: perPage } },
      })

      if (!result.data) return null

      return result.data.data
    } catch {
      return null
    }
  },

  async updateDrug(
    apiClient: ClientType,
    id: number,
    body: { drugName: string; url: string; note?: string | null },
  ) {
    const result = await apiClient.PUT('/api/drugs/{id}', {
      params: { path: { id } },
      body: { drugName: body.drugName, url: body.url, note: body.note },
    })
    if (result.error) {
      console.error('[drugRepository] updateDrug error:', result.error)
      return false
    }
    return true
  },

  async getDrug(apiClient: ClientType, id: number) {
    try {
      const result = await apiClient.GET('/api/drugs/{id}', {
        params: { path: { id } },
      })

      if (!result.data) return null

      return result.data.data
    } catch {
      return null
    }
  },
}
