import { cookies } from 'next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'
import SetupForm from 'components/setup/SetupForm'

export default async function PageSetup() {
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const apiClient = createServerApiClient({ cookie })
  const user = await userRepository.getCurrentUser(apiClient)

  return <SetupForm />
}
