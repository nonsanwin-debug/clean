'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { loginPartner } from '../actions'

export default function PartnerLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!email) {
            alert('이메일을 입력해주세요.')
            return
        }

        setLoading(true)
        try {
            const result = await loginPartner(email)

            if (result.success) {
                alert(result.message)
                router.push('/partner/dashboard')
            } else {
                alert(result.message)
            }
        } catch (error) {
            alert('오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = () => {
        // Simulation for Social Login: Prompt for email to test validation
        const verifiedEmail = prompt("테스트할 파트너 계정의 이메일을 입력하세요:", "partner@example.com")
        if (verifiedEmail) {
            setEmail(verifiedEmail)
            // Trigger login logic with the input email
            loginPartner(verifiedEmail).then(result => {
                if (result.success) {
                    alert(result.message)
                    router.push('/partner/dashboard')
                } else {
                    alert(result.message)
                }
            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">파트너 로그인</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                            {loading ? '로그인 확인 중...' : '이메일로 로그인'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                또는 소셜 로그인 (승인여부 확인)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button
                            className="w-full bg-[#FAE100] hover:bg-[#FAE100]/90 text-black font-bold"
                            onClick={handleSocialLogin}
                            type="button"
                        >
                            카카오로 시작하기
                        </Button>
                        <Button
                            className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 font-bold"
                            onClick={handleSocialLogin}
                            type="button"
                        >
                            네이버로 시작하기
                        </Button>
                    </div>
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
