export const apiBasePath =
  process.env.NEXT_PUBLIC_API_BASE_PATH ?? 'http://localhost:8080'

export const ssrApiBasePath = process.env.SSR_API_BASE_PATH ?? apiBasePath

export const loginPath = '/auth0/login'

export const logoutPath = '/auth0/logout'

export const discordLinkPath = '/api/discord/link'

export function loginPathWithReturnToURL(redirectPath: string) {
  return loginPath + '?return_to=' + encodeURI(redirectPath)
}

export function checkRedirectPath(path: string) {
  return path.startsWith('/')
}
