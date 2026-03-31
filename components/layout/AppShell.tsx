'use client'

import {
  Fragment,
  useState,
  useCallback,
  useRef,
  useSyncExternalStore,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from 'components/ui/sheet'
import { Button } from 'components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar'
import { Separator } from 'components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  User,
  Sun,
  Moon,
  Settings,
  LogOut,
} from 'lucide-react'
import { useTheme } from 'components/theme/ThemeProvider'
import { cn } from '@/lib/utils'

const SIDEBAR_WIDTH = 280
const MOBILE_BREAKPOINT = 768

const mobileQuery = `(max-width: ${MOBILE_BREAKPOINT}px)`

function subscribeToMobile(callback: () => void) {
  const mq = window.matchMedia(mobileQuery)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getIsMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches
}

function getIsMobileServerSnapshot() {
  return false
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeToMobile,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot,
  )
}

interface NavItem {
  text: string
  href: string
}

interface NavGroup {
  text: string
  href: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    text: '服薬指導室',
    href: '/dashboard',
    items: [
      { text: 'ダッシュボード', href: '/dashboard' },
      { text: '薬一覧', href: '/medication/drugs' },
      { text: '服薬履歴', href: '/medication/history' },
    ],
  },
]

const NAV_EXTRA: NavItem[] = [{ text: '設定', href: '/settings' }]

interface AppShellProps {
  children: React.ReactNode
  user?: {
    name: string
    iconUrl: string | null
  }
  breadcrumbs?: { text: string; href: string }[]
}

export default function AppShell({
  children,
  user,
  breadcrumbs,
}: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { mode, toggleMode } = useTheme()
  const [hydrated, setHydrated] = useState(false)
  const [sidebarOpen, setSidebarOpenState] = useState(() => {
    if (typeof document === 'undefined') return true
    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('grace-sidebar-open='))
    if (!cookie) return true
    return cookie.split('=')[1] !== 'false'
  })
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [groupOpen, setGroupOpen] = useState(true)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open)
    document.cookie = `grace-sidebar-open=${open}; path=/; max-age=31536000`
  }, [])

  const shellRef = useCallback((node: HTMLElement | null) => {
    if (node) setHydrated(true)
  }, [])

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const handleEdgeEnter = useCallback(() => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => {
      setOverlayVisible(true)
    }, 100)
  }, [clearHoverTimer])

  const handleOverlayLeave = useCallback(() => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => {
      setOverlayVisible(false)
    }, 200)
  }, [clearHoverTimer])

  const handleOverlayEnter = useCallback(() => {
    clearHoverTimer()
  }, [clearHoverTimer])

  const showSidebarInline = sidebarOpen && !isMobile
  const showMenuButton = !showSidebarInline

  const activeHref = pathname.startsWith('/medication/drugs')
    ? '/medication/drugs'
    : pathname.startsWith('/medication/history')
      ? '/medication/history'
      : pathname

  const handleNavClick = useCallback(
    (href: string) => {
      router.push(href)
      setOverlayVisible(false)
    },
    [router],
  )

  const sideNavContent = (
    <nav className="flex flex-col gap-1 py-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.href}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent"
            onClick={() => setGroupOpen((prev) => !prev)}
          >
            {groupOpen ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            {group.text}
          </button>
          {groupOpen && (
            <div className="ml-4 flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                    activeHref === item.href &&
                      'bg-accent font-medium text-accent-foreground',
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <Separator className="my-1" />
      {NAV_EXTRA.map((item) => (
        <button
          type="button"
          key={item.href}
          className={cn(
            'rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
            activeHref === item.href &&
              'bg-accent font-medium text-accent-foreground',
          )}
          onClick={() => handleNavClick(item.href)}
        >
          {item.text}
        </button>
      ))}
    </nav>
  )

  return (
    <div
      ref={shellRef}
      className={cn('flex h-screen', !hydrated && 'opacity-0')}
    >
      {/* Desktop inline sidebar */}
      {showSidebarInline && (
        <aside
          className="hidden md:flex flex-col shrink-0 border-r bg-sidebar text-sidebar-foreground overflow-hidden"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/dashboard"
              className="text-lg font-bold hover:opacity-80"
            >
              Grace
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="サイドバーを閉じる"
              onClick={() => setSidebarOpen(false)}
            >
              <PanelLeftClose className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">{sideNavContent}</div>
        </aside>
      )}

      {/* Desktop hover edge */}
      {!isMobile && !sidebarOpen && !overlayVisible && (
        <div
          className="fixed top-0 left-0 z-[9998] hidden h-screen w-6 md:block"
          onMouseEnter={handleEdgeEnter}
          onMouseLeave={() => clearHoverTimer()}
        />
      )}

      {/* Desktop overlay sidebar */}
      {!isMobile && overlayVisible && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/20"
            onClick={() => setOverlayVisible(false)}
          />
          <div
            className="fixed top-0 left-0 z-[9999] flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground shadow-lg animate-in slide-in-from-left duration-150"
            style={{ width: SIDEBAR_WIDTH }}
            onMouseEnter={handleOverlayEnter}
            onMouseLeave={handleOverlayLeave}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-bold">Grace</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="サイドバーを固定"
                onClick={() => {
                  setSidebarOpen(true)
                  setOverlayVisible(false)
                }}
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-2">{sideNavContent}</div>
          </div>
        </>
      )}

      {/* Mobile sidebar (Sheet) */}
      <Sheet
        open={isMobile && overlayVisible}
        onOpenChange={(open) => !open && setOverlayVisible(false)}
      >
        <SheetContent side="left" className="w-[85vw] max-w-[280px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-lg font-bold">Grace</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto px-2">{sideNavContent}</div>
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center border-b bg-background px-4 h-12 shrink-0">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="メニューを開く"
              className="mr-2"
              onClick={() => {
                if (isMobile) {
                  setOverlayVisible(true)
                } else {
                  setSidebarOpen(true)
                }
              }}
            >
              <Menu className="size-4" />
            </Button>
          )}
          <Link
            href="/dashboard"
            className="text-base font-bold hover:opacity-80"
          >
            Grace
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="テーマ切替"
              onClick={toggleMode}
            >
              {mode === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="size-7">
                      {user.iconUrl ? (
                        <AvatarImage src={user.iconUrl} alt={user.name} />
                      ) : null}
                      <AvatarFallback>
                        <User className="size-3.5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm hidden sm:inline">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push('/settings')}
                  >
                    <Settings className="mr-2 size-4" />
                    設定
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      window.location.href = '/logout'
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="border-b px-4 py-2">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i) => (
                  <Fragment key={crumb.href}>
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.text}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
