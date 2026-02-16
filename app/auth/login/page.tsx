import { redirect } from 'next/navigation'
import LoginPage from 'components/auth/login/LoginPage'
import { getCurrentUser } from 'libs/api/user'
import { getAuthCookieNextHeaders } from 'libs/next/headers'
import { checkRedirectPath } from 'utils/urls'

export default async function Page(props: {
  searchParams: Promise<{ return_to?: string }>
}) {
  const searchParams = await props.searchParams
  const headers = await getAuthCookieNextHeaders()
  const user = await getCurrentUser(headers)

  if (user) {
    const returnTo = searchParams.return_to
    redirect(
      returnTo && checkRedirectPath(returnTo) ? returnTo : '/dashboard',
    )
  }

  return <LoginPage returnTo={searchParams.return_to} />
}
