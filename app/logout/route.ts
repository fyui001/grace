import { NextRequest, NextResponse } from 'next/server'

const sophiaBaseUrl = process.env.SSR_API_BASE_PATH ?? 'http://sophia'

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie') ?? ''
  const res = await fetch(`${sophiaBaseUrl}/auth0/logout`, {
    method: 'POST',
    headers: { cookie },
    redirect: 'manual',
  })

  const location = res.headers.get('location')
  if (location) {
    const redirect = NextResponse.redirect(location)
    const setCookies = res.headers.getSetCookie()
    for (const sc of setCookies) {
      redirect.headers.append('Set-Cookie', sc)
    }
    return redirect
  }

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  })
}
