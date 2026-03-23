import type { ClientType } from './types'

export const userRepository = {
  async getCurrentUser(apiClient: ClientType) {
    try {
      const result = await apiClient.GET('/api/user')

      if (!result.data) {
        return null
      }

      return result.data.data
    } catch {
      return null
    }
  },

  async registerUser(apiClient: ClientType, name: string) {
    const result = await apiClient.POST('/api/user/register', {
      body: { name },
    })

    if (!result.data) {
      throw new Error('Registration failed')
    }

    return result.data.data
  },

  async unlinkDiscord(apiClient: ClientType) {
    const result = await apiClient.DELETE('/api/user/discord')

    if (!result.data) {
      throw new Error('Failed to unlink Discord')
    }

    return result.data.data
  },
}
