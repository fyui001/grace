import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from 'client/serverApiClient'
import { userRepository } from 'repository/userRepository'

function redirectToLoginPage(request: NextRequest) {
  const returnTo = request.nextUrl.pathname + request.nextUrl.search
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('return_to', returnTo)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  const themeMode = request.cookies.get('grace-theme-mode')?.value ?? 'light'
  const sidebarOpen = request.cookies.get('grace-sidebar-open')?.value ?? 'true'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-theme-mode', themeMode === 'dark' ? 'dark' : 'light')
  requestHeaders.set(
    'x-sidebar-open',
    sidebarOpen === 'false' ? 'false' : 'true',
  )

  if (
    request.nextUrl.pathname.match(/^\/(dashboard|settings|medication)(\/|$)/)
  ) {
    const cookie = request.headers.get('cookie') ?? ''
    const apiClient = createServerApiClient({ cookie })
    const currentUser = await userRepository.getCurrentUser(apiClient)

    if (!currentUser) {
      return redirectToLoginPage(request)
    }

    if (!currentUser.isRegistered) {
      return NextResponse.redirect(new URL('/setup', request.url))
    }
  }

  if (request.nextUrl.pathname === '/setup') {
    const cookie = request.headers.get('cookie') ?? ''
    const apiClient = createServerApiClient({ cookie })
    const currentUser = await userRepository.getCurrentUser(apiClient)

    if (!currentUser) {
      return redirectToLoginPage(request)
    }

    if (currentUser.isRegistered) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/(dashboard|settings|medication)(/?.*)', '/setup'],
}
