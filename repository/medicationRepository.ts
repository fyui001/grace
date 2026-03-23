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
}
