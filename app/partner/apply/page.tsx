'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { submitPartnerApplication } from '../actions'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIES = [
    { id: 'home', label: '입주/집 청소' },
    { id: 'appliance', label: '가전/가구 청소' },
    { id: 'business', label: '사업장 청소' },
    { id: 'special', label: '특수 청소' },
    { id: 'disposal', label: '철거/폐기' },
]

const DETAILED_SERVICES = [
    '(긴급)싱크대 막힘', '이사/입주 청소', '거주 청소', '곰팡이 제거', '나노코팅 시공',
    '보일러 청소', '수도배관 청소', '새집/헌집증후군 시공', '줄눈 시공', '하수구 청소',
    '가구 청소', '가전제품 청소', '냉장고 청소', '세탁기 청소', '소파 청소',
    '에어컨 청소', '온풍기/냉난방기 청소', '침대/매트리스 청소', '건물내부 청소',
    '건물외부 청소', '닥트/환풍구 청소', '바닥 청소 (왁스 코팅)', '사무실 청소',
    '상업공간 청소', '준공 청소', '카페트 청소'
]

export default function PartnerApplyPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        categories: [] as string[],
        services: [] as string[],
        name: '',
        phone: '',
        area: '',
        experience: '',
        loginMethod: ''
    })

    const handleCategoryToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(id)
                ? prev.categories.filter(c => c !== id)
                : [...prev.categories, id]
        }))
    }

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }))
    }

    const handleSubmit = async (method: string) => {
        setLoading(true)

        // In a real app, this would trigger different flows based on method
        // For now, we simulate all as successful submission after basic info check
        if (!formData.name || !formData.phone) {
            alert('필수 정보를 입력해주세요.')
            setLoading(false)
            return
        }

        try {
            const result = await submitPartnerApplication({
                ...formData,
                loginMethod: method
            })
            if (result.success) {
                alert('파트너 신청이 완료되었습니다.\n관리자 승인 후 이용 가능합니다.')
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
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 w-12 rounded-full ${step >= s ? 'bg-primary' : 'bg-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {step === 1 && "어떤 서비스를 제공하시나요?"}
                        {step === 2 && "구체적인 가능한 작업을 선택해주세요"}
                        {step === 3 && "마지막으로 필수 정보를 입력해주세요"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "제공 가능한 서비스 분야를 모두 선택해주세요."}
                        {step === 2 && "고객에게 제공할 구체적인 서비스를 체크해주세요."}
                        {step === 3 && "안전한 파트너 등록을 위해 정보를 입력합니다."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CATEGORIES.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.categories.includes(cat.id)
                                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                            : 'hover:border-primary/50'
                                        }`}
                                    onClick={() => handleCategoryToggle(cat.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{cat.label}</span>
                                        {formData.categories.includes(cat.id) && (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                            {DETAILED_SERVICES.map((service) => (
                                <div
                                    key={service}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                                >
                                    <Checkbox
                                        id={service}
                                        checked={formData.services.includes(service)}
                                        onCheckedChange={() => handleServiceToggle(service)}
                                    />
                                    <Label
                                        htmlFor={service}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full py-1"
                                    >
                                        {service}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>업체명 / 성함</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="예: 깔끔청소"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>연락처</Label>
                                        <Input
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
                            </div>

                            <div className="border-t pt-6">
                                <Label className="text-base mb-4 block text-center">어떤 방식으로 시작하시겠습니까?</Label>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full bg-[#FAE100] hover:bg-[#FAE100]/90 text-black h-12 text-base font-bold"
                                        onClick={() => handleSubmit('kakao')}
                                        disabled={loading}
                                    >
                                        카카오로 시작하기
                                    </Button>
                                    <Button
                                        className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 h-12 text-base font-bold"
                                        onClick={() => handleSubmit('naver')}
                                        disabled={loading}
                                    >
                                        네이버로 시작하기
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-base"
                                        onClick={() => handleSubmit('email')}
                                        disabled={loading}
                                    >
                                        이메일로 시작하기
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> 이전
                        </Button>
                    ) : (
                        <Link href="/partner/login">
                            <Button variant="ghost">취소</Button>
                        </Link>
                    )}

                    {step < 3 && (
                        <Button onClick={() => setStep(step + 1)}>
                            다음 <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
