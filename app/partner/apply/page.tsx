'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { submitPartnerApplication } from '../actions'
import { Label } from '@/components/ui/label'

// Partner Application Page - Single Step Form
export default function PartnerApplyPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        categories: [] as string[],
        services: [] as string[],
        name: '',
        phone: '',
        area: '',
        experience: '',
        email: '',
        password: '',
        loginMethod: 'email'
    })

    const handleSubmit = async () => {
        setLoading(true)

        if (!formData.name || !formData.phone || !formData.email || !formData.password) {
            alert('모든 필수 정보를 입력해주세요.')
            setLoading(false)
            return
        }

        try {
            const result = await submitPartnerApplication({
                ...formData,
                loginMethod: 'email'
            })
            if (result.success) {
                alert('파트너 신청이 완료되었습니다.\n관리자 승인 후 로그인하실 수 있습니다.')
                router.push('/partner/login')
            } else {
                alert(result.message)
            }
        } catch (error) {
            alert("오류가 발생했습니다.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        파트너 회원가입 (Ver 2.0)
                    </CardTitle>
                    <CardDescription className="text-center">
                        서비스 제공을 위해 필수 정보를 입력해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>이메일 (아이디) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="partner@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>업체명 / 성함 <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="예: 깔끔청소"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>연락처 <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>주 활동 지역</Label>
                                <Input
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    placeholder="예: 서울 강남구"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>경력 및 소개</Label>
                                <Input
                                    value={formData.experience}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="간단한 소개를 입력해주세요"
                                />
                            </div>

                            <div className="space-y-2 border-t pt-4 mt-4">
                                <Label>비밀번호 설정 <span className="text-red-500">*</span></Label>
                                <Input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="비밀번호를 입력해주세요"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <Button
                                className="w-full h-12 text-lg bg-[#7353EA] hover:bg-[#7353EA]/90 font-bold"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? '가입 처리 중...' : '파트너 가입 완료하기'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-6">
                    <Link href="/partner/login" className="text-sm text-gray-500 hover:text-gray-900">
                        이미 계정이 있으신가요? 로그인하기
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
