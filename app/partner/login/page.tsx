'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { loginPartner } from '../actions'
import { Loader2 } from 'lucide-react'

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
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">파트너 로그인</h1>
                                <p className="text-gray-500 mt-2">새로고침 파트너 센터에 오신 것을 환영합니다</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>이메일</Label>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="partner@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>비밀번호</Label>
                                    <Input
                                        type="password"
                                        required
                                        placeholder="비밀번호를 입력해주세요"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 text-lg font-bold bg-[#7353EA] hover:bg-[#7353EA]/90" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "로그인"}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">
                                        아직 파트너가 아니신가요?
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full h-12" onClick={() => router.push('/partner/apply')}>
                                파트너 무료로 시작하기
                            </Button>
                        </div>
                    </div>
                )
            }
