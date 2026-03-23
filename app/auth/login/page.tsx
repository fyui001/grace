import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LoginPage from 'components/auth/login/LoginPage'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'
import { checkRedirectPath } from 'utils/urls'

export default async function Page(props: {
  searchParams: Promise<{ return_to?: string }>
}) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  const apiClient = createServerApiClient({ cookie })
  const user = await userRepository.getCurrentUser(apiClient)

  if (user) {
    const returnTo = searchParams.return_to
    redirect(returnTo && checkRedirectPath(returnTo) ? returnTo : '/dashboard')
  }

  return <LoginPage returnTo={searchParams.return_to} />
}
