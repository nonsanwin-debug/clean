'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { updatePartnerBenefits } from '@/app/partner/actions'
import { useRouter } from 'next/navigation'

const AVAILABLE_BENEFITS = [
    { id: 'free_old_building', label: '구축 할증 무료', description: '오래된 건물에 대한 추가 요금 면제' },
    { id: 'free_interior', label: '인테리어 할증 무료', description: '인테리어 직후 청소 추가 요금 면제' },
    { id: 'free_eco_upgrade', label: '친환경 세제 무료 업그레이드', description: '일반 세제 대신 친환경 세제 무상 제공' },
    { id: 'free_phytoncide', label: '피톤치드 시공 무료', description: '새집증후군 예방 피톤치드 시공 무상 제공' },
]

export function PartnerBenefitsManager({ partnerId, initialBenefits = [] }: { partnerId: string, initialBenefits?: string[] }) {
    const [benefits, setBenefits] = useState<string[]>(initialBenefits)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const handleToggle = async (benefitId: string, checked: boolean | 'indeterminate') => {
        setIsSaving(true)
        const isChecked = checked === true
        const newBenefits = isChecked
            ? [...benefits, benefitId]
            : benefits.filter(id => id !== benefitId)
        
        setBenefits(newBenefits)

        const result = await updatePartnerBenefits(partnerId, newBenefits)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
            setBenefits(benefits)
        }
        setIsSaving(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>고객 혜택 관리</CardTitle>
                <CardDescription>이 파트너가 고객에게 제공하는 무료 혜택을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {AVAILABLE_BENEFITS.map((benefit) => (
                    <div key={benefit.id} className="flex items-center justify-between space-x-2 py-2">
                        <div className="flex flex-col space-y-1">
                            <span className="font-medium">{benefit.label}</span>
                            <span className="text-sm text-muted-foreground">{benefit.description}</span>
                        </div>
                        <Checkbox 
                            checked={benefits.includes(benefit.id)}
                            onCheckedChange={(checked) => handleToggle(benefit.id, checked)}
                            disabled={isSaving}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
