import { ssrApiClient } from './client'

export type CurrentUser = {
  id: string
  name: string
  email: string
}

export async function getCurrentUser(
  headers: HeadersInit,
): Promise<CurrentUser | null> {
  try {
    const cookieHeader =
      headers instanceof Headers
        ? headers.get('cookie') ?? ''
        : Array.isArray(headers)
          ? (headers.find(([key]) => key.toLowerCase() === 'cookie')?.[1] ?? '')
          : (headers['cookie'] ?? '')

    const res = await ssrApiClient.get<CurrentUser>('/api/user', {
      headers: { cookie: cookieHeader },
      validateStatus: (status) => status < 500,
    })

    if (res.status === 200) {
      return res.data
    }

    return null
  } catch {
    return null
  }
}
