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

  async createDrug(
    apiClient: ClientType,
    body: { drugName: string; url: string },
  ) {
    try {
      const result = await apiClient.POST('/api/drugs', { body })
      if (result.error) {
        console.error('[drugRepository] createDrug error:', result.error)
        return false
      }
      return true
    } catch (e) {
      console.error('[drugRepository] createDrug exception:', e)
      return false
    }
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
