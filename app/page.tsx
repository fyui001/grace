import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'

export default async function PageHome() {
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
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
