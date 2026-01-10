'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function PartnerLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Mock Login for Demo
        setTimeout(() => {
            if (email && password) {
                alert('로그인 성공 (데모)')
                router.push('/partner/dashboard')
            } else {
                alert('이메일과 비밀번호를 입력해주세요.')
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">파트너 로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">이메일</label>
                            <Input
                                type="email"
                                placeholder="partner@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">비밀번호</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        아직 파트너가 아니신가요? <Link href="/partner/apply" className="text-primary cursor-pointer hover:underline">파트너 등록 신청</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
