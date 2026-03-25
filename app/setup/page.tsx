import { getCookieString } from 'libs/next/headers'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'
import SetupForm from 'components/setup/SetupForm'

export default async function PageSetup() {
  const cookie = await getCookieString()
  const apiClient = createServerApiClient({ cookie })
  await userRepository.getCurrentUser(apiClient)

  return <SetupForm />
}
