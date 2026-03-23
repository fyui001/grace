import { cookies } from 'next/headers'

export async function getAuthCookieNextHeaders(): Promise<Headers> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const result = new Headers()
  result.set('cookie', cookieHeader)
  return result
}

export function getNextHeaderFromRequestOnlyCookie(
  request: { headers: Headers } & { cookies?: unknown },
): Headers {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const result = new Headers()
  result.set('cookie', cookieHeader)
  return result
}
