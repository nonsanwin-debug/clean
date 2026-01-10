'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { login, signup } from './actions'
import { toast } from 'sonner' // Assuming sonner is installed, or use alert

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleEmailAuth = async (formData: FormData, mode: 'login' | 'signup') => {
        setLoading(true)
        setMessage('')

        const action = mode === 'login' ? login : signup
        const result = await action(formData)

        setLoading(false)
        if (result?.success === false) {
            setMessage(result.message)
        } else if (result?.success) {
            setMessage(result.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <Link href="/" className="mb-8">
                <span className="text-2xl font-bold tracking-tighter cursor-pointer">
                    새로<span className="text-[#7353EA]">고침</span>
                </span>
            </Link>

            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">로그인</CardTitle>
                    <CardDescription>
                        견적 요청을 위해 로그인이 필요합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={(formData) => handleEmailAuth(formData, 'login')} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {message && <p className="text-sm text-red-500 font-medium">{message}</p>}
                        <Button className="w-full bg-[#7353EA] hover:bg-[#7353EA]/90" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : '로그인'}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            계정이 없으신가요? 비밀번호를 입력하고 <button formAction={(formData) => handleEmailAuth(formData, 'signup')} className="text-[#7353EA] underline hover:text-[#7353EA]/80 font-medium">회원가입</button>을 누르세요.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
