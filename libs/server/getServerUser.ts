import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'

export async function getServerUser() {
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  const user = await userRepository.getCurrentUser(apiClient)

  if (!user) return null

  return {
    name: user.name ?? '',
    iconUrl: user.iconUrl ?? null,
    discordUserId: user.discordUserId ?? null,
  }
}
