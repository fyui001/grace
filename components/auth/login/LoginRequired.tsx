'use client'

import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { AlertTriangle, Key } from 'lucide-react'
import { loginPath, loginPathWithReturnToURL } from 'utils/urls'

export default function LoginRequired({ returnTo }: { returnTo?: string }) {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-md px-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center">Grace</h1>
          <Card>
            <CardHeader>
              <CardTitle>ログイン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-950">
                  <AlertTriangle className="size-5 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">ログインしてください</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      このページを表示するにはログインが必要です。
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button asChild>
                    <a
                      href={
                        returnTo
                          ? loginPathWithReturnToURL(returnTo)
                          : loginPath
                      }
                    >
                      <Key className="size-4" />
                      ログインページへ
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
