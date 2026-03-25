export function setPageSizeCookie(cookieName: string, size: number) {
  document.cookie = `${cookieName}=${size}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}
