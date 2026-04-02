'use client'

import { Fragment, useState, useCallback, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb'
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
  X,
  LayoutDashboard,
  Pill,
  ClipboardList,
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
  icon: React.ComponentType<{ className?: string }>
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
      { text: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
      { text: '薬一覧', href: '/medication/drugs', icon: Pill },
      { text: '服薬履歴', href: '/medication/history', icon: ClipboardList },
    ],
  },
]

const NAV_EXTRA: NavItem[] = [
  { text: '設定', href: '/settings', icon: Settings },
]

const SIDEBAR_COLLAPSED_WIDTH = 56

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
  const [sidebarOpen, setSidebarOpenState] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(true)

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open)
    document.cookie = `grace-sidebar-open=${open}; path=/; max-age=31536000`
  }, [])

  const shellRef = useCallback((node: HTMLElement | null) => {
    if (!node) return
    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('grace-sidebar-open='))
    if (cookie && cookie.split('=')[1] === 'false') {
      setSidebarOpenState(false)
    }
    setHydrated(true)
  }, [])

  const activeHref = pathname.startsWith('/medication/drugs')
    ? '/medication/drugs'
    : pathname.startsWith('/medication/history')
      ? '/medication/history'
      : pathname

  const handleNavClick = useCallback(
    (href: string) => {
      router.push(href)
      setMobileMenuOpen(false)
    },
    [router],
  )

  const allNavItems = [...NAV_GROUPS.flatMap((g) => g.items), ...NAV_EXTRA]

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
            <div className="ml-2 flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
                    activeHref === item.href &&
                      'bg-accent font-medium text-accent-foreground',
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <item.icon className="size-4 shrink-0" />
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
            'flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
            activeHref === item.href &&
              'bg-accent font-medium text-accent-foreground',
          )}
          onClick={() => handleNavClick(item.href)}
        >
          <item.icon className="size-4 shrink-0" />
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
      {/* Desktop sidebar — expanded or collapsed icon rail */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 border-r bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] overflow-hidden transition-[width] duration-200',
        )}
        style={{ width: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
      >
        {sidebarOpen ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex items-center justify-center py-3">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="サイドバーを開く"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            </div>
            <nav className="flex flex-1 flex-col items-center gap-1 py-2">
              {allNavItems.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  title={item.text}
                  className={cn(
                    'flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent',
                    activeHref === item.href &&
                      'bg-accent text-accent-foreground',
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <item.icon className="size-4" />
                </button>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 z-[1001] flex h-screen flex-col border-r bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] animate-in slide-in-from-left duration-150"
            style={{
              width: '85vw',
              maxWidth: SIDEBAR_WIDTH,
              boxShadow: '0 0 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-bold">Grace</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="メニューを閉じる"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-2">{sideNavContent}</div>
          </aside>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center border-b bg-background px-4 h-12 shrink-0">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="メニューを開く"
              className="mr-2"
              onClick={() => setMobileMenuOpen(true)}
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
