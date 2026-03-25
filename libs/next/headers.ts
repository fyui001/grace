import { cookies } from 'next/headers'

export async function getCookieString(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
}

export async function getAuthCookieNextHeaders(): Promise<Headers> {
  const cookieHeader = await getCookieString()
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
