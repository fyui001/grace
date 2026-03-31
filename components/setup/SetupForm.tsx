'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useApiClient } from 'client/apiClient'
import { userRepository } from 'repository/userRepository'

export default function SetupForm({ email }: { email?: string }) {
  const router = useRouter()
  const apiClient = useApiClient()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('表示名を入力してください')
      nameInputRef.current?.focus()
      return
    }

    setLoading(true)
    setError('')

    try {
      await userRepository.registerUser(apiClient, name.trim())
      router.push('/dashboard')
    } catch {
      setError('登録に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-md px-4">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Grace</h1>
            <p className="text-sm text-muted-foreground mt-1">
              はじめに、あなたのプロフィールを設定しましょう
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>プロフィール設定</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >
                <div className="flex flex-col gap-5">
                  {email && (
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        メールアドレス
                      </dt>
                      <dd className="text-sm mt-1">{email}</dd>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">表示名</Label>
                    <p className="text-sm text-muted-foreground">
                      アプリ内で使用される名前です
                    </p>
                    <Input
                      ref={nameInputRef}
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例：太郎"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'はじめる...' : 'はじめる'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
