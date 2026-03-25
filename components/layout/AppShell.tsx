'use client'

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useSyncExternalStore,
} from 'react'
import styled from '@emotion/styled'
import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  SideNavigation,
  TopNavigation,
} from '@cloudscape-design/components'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'components/theme/ThemeProvider'

const SIDEBAR_WIDTH = 280
const MOBILE_BREAKPOINT = 768

const ShellContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  &[data-hydrated='true'] {
    opacity: 1;
  }
`

const SidebarPanel = styled.nav`
  width: ${SIDEBAR_WIDTH}px;
  flex-shrink: 0;
  background: var(--color-background-cell-shaded-v7o6so, #f6f6f9);
  border-right: 1px solid var(--color-border-divider-default);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px;
  flex-shrink: 0;
`

const SidebarBody = styled.div`
  flex: 1;
  overflow-y: auto;
`

const HoverEdge = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 24px;
  height: 100vh;
  z-index: 1000;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  background: var(--color-background-cell-shaded-v7o6so, #f6f6f9);
  border-right: 1px solid var(--color-border-divider-default);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: sidebarSlideIn 150ms ease;

  @keyframes sidebarSlideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 85vw;
    max-width: ${SIDEBAR_WIDTH}px;
  }
`

const OverlayBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);

  @media (min-width: ${MOBILE_BREAKPOINT + 1}px) {
    background: transparent;
  }
`

const MainArea = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TopBar = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
`

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  padding: 0 4px;
  background: var(--color-background-container-content-6u8rvp, #ffffff);
  border-bottom: 1px solid var(--color-border-divider-default);
`

const TopNavWrapper = styled.div`
  flex: 1;
  min-width: 0;
`

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
`

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

interface AppShellProps {
  children: React.ReactNode
  user?: {
    name: string
    iconUrl: string | null
  }
  breadcrumbs?: { text: string; href: string }[]
  pageTitle?: string
  contentType?: 'default' | 'table' | 'form' | 'cards' | 'wizard'
}

export default function AppShell({
  children,
  user,
  breadcrumbs,
  pageTitle,
  contentType = 'default',
}: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { mode, toggleMode } = useTheme()
  const [hydrated, setHydrated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shellRef = useCallback((node: HTMLElement | null) => {
    if (node) setHydrated(true)
  }, [])

  const topNavRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new MutationObserver(() => {
      node.querySelectorAll('.awsui-context-top-navigation').forEach((el) => {
        el.classList.remove('awsui-context-top-navigation')
      })
    })
    node.querySelectorAll('.awsui-context-top-navigation').forEach((el) => {
      el.classList.remove('awsui-context-top-navigation')
    })
    observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
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

  const navItems: React.ComponentProps<typeof SideNavigation>['items'] =
    useMemo(
      () => [
        {
          type: 'expandable-link-group',
          text: '服薬指導室',
          href: '/dashboard',
          items: [
            { type: 'link', text: 'ダッシュボード', href: '/dashboard' },
            { type: 'link', text: '薬一覧', href: '/medication/drugs' },
            { type: 'link', text: '服薬履歴', href: '/medication/history' },
          ],
        },
        { type: 'divider' },
        { type: 'link', text: '設定', href: '/settings' },
      ],
      [],
    )

  const handleFollow = useCallback(
    (event: CustomEvent<{ href: string }>) => {
      event.preventDefault()
      router.push(event.detail.href)
      setOverlayVisible(false)
    },
    [router],
  )

  const sideNav = (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: '/dashboard', text: 'Grace' }}
      onFollow={handleFollow}
      items={navItems}
    />
  )

  const handleMenuButtonClick = useCallback(() => {
    if (isMobile) {
      setOverlayVisible(true)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  return (
    <ShellContainer ref={shellRef} data-hydrated={hydrated}>
      {showSidebarInline && (
        <SidebarPanel>
          <SidebarHeader>
            <Button
              iconName="angle-left-double"
              variant="icon"
              onClick={() => setSidebarOpen(false)}
            />
          </SidebarHeader>
          <SidebarBody>{sideNav}</SidebarBody>
        </SidebarPanel>
      )}

      {!isMobile && !sidebarOpen && !overlayVisible && (
        <HoverEdge
          onMouseEnter={handleEdgeEnter}
          onMouseLeave={() => clearHoverTimer()}
        />
      )}

      {overlayVisible && (
        <>
          <OverlayBackdrop onClick={() => setOverlayVisible(false)} />
          <Overlay
            onMouseEnter={!isMobile ? handleOverlayEnter : undefined}
            onMouseLeave={!isMobile ? handleOverlayLeave : undefined}
          >
            <SidebarHeader>
              {isMobile ? (
                <Button
                  iconName="close"
                  variant="icon"
                  onClick={() => setOverlayVisible(false)}
                />
              ) : (
                <Button
                  iconName="angle-right-double"
                  variant="icon"
                  onClick={() => {
                    setSidebarOpen(true)
                    setOverlayVisible(false)
                  }}
                />
              )}
            </SidebarHeader>
            <SidebarBody>{sideNav}</SidebarBody>
          </Overlay>
        </>
      )}

      <MainArea>
        <TopBar>
          {showMenuButton && (
            <MenuButton>
              <Button
                iconName="menu"
                variant="icon"
                onClick={handleMenuButtonClick}
              />
            </MenuButton>
          )}
          <TopNavWrapper ref={topNavRef}>
            <TopNavigation
              identity={{
                href: '/dashboard',
                title: pageTitle ?? 'Grace',
                onFollow: (e) => {
                  e.preventDefault()
                  router.push('/dashboard')
                },
              }}
              utilities={[
                {
                  type: 'button',
                  iconName: mode === 'dark' ? 'star-filled' : 'star',
                  text: mode === 'dark' ? 'Dark' : 'Light',
                  title:
                    mode === 'dark'
                      ? 'ライトモードに切替'
                      : 'ダークモードに切替',
                  onClick: toggleMode,
                },
                {
                  type: 'menu-dropdown',
                  iconUrl: user?.iconUrl ?? undefined,
                  iconName: user?.iconUrl ? undefined : 'user-profile',
                  text: user?.name ?? '',
                  title: user?.name ?? '',
                  items: [
                    {
                      id: 'logout',
                      text: 'ログアウト',
                      iconName: 'external',
                    },
                  ],
                  onItemClick: ({ detail }) => {
                    if (detail.id === 'logout') {
                      window.location.href = '/logout'
                    }
                  },
                },
              ]}
              i18nStrings={{
                overflowMenuTriggerText: 'メニュー',
                overflowMenuTitleText: 'メニュー',
              }}
            />
          </TopNavWrapper>
        </TopBar>
        <ContentArea>
          <AppLayout
            navigationHide
            breadcrumbs={
              breadcrumbs ? (
                <BreadcrumbGroup
                  items={breadcrumbs}
                  onFollow={(event) => {
                    event.preventDefault()
                    router.push(event.detail.href)
                  }}
                />
              ) : undefined
            }
            content={children}
            contentType={contentType}
            toolsHide
          />
        </ContentArea>
      </MainArea>
    </ShellContainer>
  )
}
