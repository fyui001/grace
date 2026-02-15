import { redirect } from 'next/navigation'
import { getCurrentUser } from 'libs/api/user'
import { getAuthCookieNextHeaders } from 'libs/next/headers'

export default async function PageHome() {
  const headers = await getAuthCookieNextHeaders()
  const user = await getCurrentUser(headers)

  if (!user) {
    redirect('/auth/login')
  }

  redirect('/dashboard')
}
