import type { ClientType } from './types'

export const medicationRepository = {
  async getMedicationHistories(
    apiClient: ClientType,
    page?: number,
    perPage?: number,
  ) {
    try {
      const result = await apiClient.GET('/api/medication-histories', {
        params: { query: { page, per_page: perPage } },
      })

      if (!result.data) return null

      return result.data.data
    } catch {
      return null
    }
  },

  async updateMedicationHistory(
    apiClient: ClientType,
    id: number,
    body: { amount: number; note?: string | null },
  ) {
    const result = await apiClient.PUT('/api/medication-histories/{id}', {
      params: { path: { id } },
      body: { amount: body.amount, note: body.note },
    })
    if (result.error) {
      console.error(
        '[medicationRepository] updateMedicationHistory error:',
        result.error,
      )
      return false
    }
    return true
  },

  async getMedicationHistory(apiClient: ClientType, id: number) {
    try {
      const result = await apiClient.GET('/api/medication-histories/{id}', {
        params: { path: { id } },
      })

      if (!result.data) return null

      return result.data.data
    } catch {
      return null
    }
  },
}
