import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from 'libs/api/user'
import { getNextHeaderFromRequestOnlyCookie } from 'libs/next/headers'

function redirectToLoginPage(request: NextRequest) {
  const returnTo = request.nextUrl.pathname + request.nextUrl.search
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('return_to', returnTo)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  const headers = getNextHeaderFromRequestOnlyCookie(request)
  const currentUser = await getCurrentUser(headers)

  if (!currentUser) {
    return redirectToLoginPage(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/(dashboard|settings)(/?.*)',
}
