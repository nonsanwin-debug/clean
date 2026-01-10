'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export default function PartnerApplyPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: '',
        experience: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Mock Submission
        setTimeout(() => {
            alert('신청이 성공적으로 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다.')
            router.push('/partner/login')
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">파트너 등록 신청</CardTitle>
                    <CardDescription className="text-center">
                        클린마스터와 함께 성장할 전문가님을 모십니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">업체명 / 성함</label>
                            <Input
                                required
                                placeholder="예: 깔끔청소"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">연락처</label>
                            <Input
                                required
                                type="tel"
                                placeholder="010-0000-0000"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">주 활동 지역</label>
                            <Input
                                required
                                placeholder="예: 서울 강남구, 경기 성남시"
                                value={formData.area}
                                onChange={e => setFormData({ ...formData, area: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">경력 및 소개</label>
                            <Input
                                required
                                placeholder="간단한 경력과 전문 분야를 적어주세요"
                                value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button type="submit" className="w-full h-11 text-lg" disabled={loading}>
                                {loading ? '신청서 제출 중...' : '등록 신청하기'}
                            </Button>
                            <Link href="/partner/login">
                                <Button variant="outline" className="w-full" type="button">
                                    취소하고 돌아가기
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
