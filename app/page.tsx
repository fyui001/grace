import { redirect } from 'next/navigation'
import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'

export default async function PageHome() {
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  const user = await userRepository.getCurrentUser(apiClient)

  if (!user) {
    redirect('/auth/login')
  }

  if (!user.isRegistered) {
    redirect('/setup')
  }

  redirect('/dashboard')
}
