'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { approvePartner } from "@/app/partner/actions"
import { format } from "date-fns"

type Partner = {
    id: string
    created_at: string
    status: string
    name: string
    phone: string
    area: string
    experience: string
}

export function PartnerTable({ partners }: { partners: Partner[] }) {
    const handleApprove = async (id: string) => {
        if (!confirm('이 파트너를 승인하시겠습니까?')) return

        const result = await approvePartner(id)
        if (result.success) {
            alert('승인되었습니다.')
        } else {
            alert(result.message)
        }
    }

    if (!partners || partners.length === 0) {
        return <div className="p-8 text-center text-muted-foreground border rounded-lg bg-slate-50">신청한 파트너가 없습니다.</div>
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                        <th className="px-6 py-3">신청일</th>
                        <th className="px-6 py-3">업체명 / 연락처</th>
                        <th className="px-6 py-3">지역 / 경력</th>
                        <th className="px-6 py-3">상태</th>
                        <th className="px-6 py-3">관리</th>
                    </tr>
                </thead>
                <tbody>
                    {partners.map((partner) => (
                        <tr key={partner.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4">
                                {format(new Date(partner.created_at), 'yyyy-MM-dd HH:mm')}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{partner.name}</div>
                                <div className="text-xs text-slate-500">{partner.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div>{partner.area}</div>
                                <div className="text-xs text-slate-500">{partner.experience}</div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={partner.status === 'approved' ? 'default' : 'secondary'}>
                                    {partner.status === 'approved' ? '승인됨' : '대기중'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                {partner.status === 'pending' && (
                                    <Button size="sm" onClick={() => handleApprove(partner.id)}>
                                        승인하기
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
