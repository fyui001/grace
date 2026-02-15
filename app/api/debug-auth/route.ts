import { NextResponse } from 'next/server'
import { getAuthCookieNextHeaders } from 'libs/next/headers'
import { ssrApiClient } from 'libs/api/client'
import { ssrApiBasePath } from 'utils/urls'

export async function GET() {
  const headers = await getAuthCookieNextHeaders()
  const cookieHeader = headers.get('cookie') ?? ''

  let status = null
  let data = null
  let error = null
  try {
    const res = await ssrApiClient.get('/api/user', {
      headers: { cookie: cookieHeader },
      validateStatus: () => true,
    })
    status = res.status
    data = res.data
  } catch (e) {
    error = String(e)
  }

  return NextResponse.json({
    ssrApiBasePath,
    cookieLength: cookieHeader.length,
    apiStatus: status,
    apiData: data,
    error,
  })
}
