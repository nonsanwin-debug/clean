'use client'

import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

type Request = {
    id: string
    created_at: string
    status: string
    service_type: string
    sq_ft: string
    target_date: string | null
    location: string
    description: string | null
    customer_name: string
    customer_phone: string
}

export function RequestTable({ requests }: { requests: Request[] }) {
    if (!requests || requests.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">접수된 요청이 없습니다.</div>
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">신청일 / 희망일</th>
                        <th scope="col" className="px-6 py-3">고객 정보</th>
                        <th scope="col" className="px-6 py-3">서비스 / 평수</th>
                        <th scope="col" className="px-6 py-3">위치 / 요청사항</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {format(new Date(req.created_at), 'MM/dd HH:mm')}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    희망: {req.target_date ? format(new Date(req.target_date), 'yyyy-MM-dd') : '미지정'}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{req.customer_name}</div>
                                <div className="text-xs text-slate-500">{req.customer_phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="capitalize font-medium">
                                    {req.service_type === 'move_in' && '입주/이사'}
                                    {req.service_type === 'residence' && '거주'}
                                    {req.service_type === 'commercial' && '상가/사무실'}
                                </div>
                                <div className="text-xs">{req.sq_ft}평</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate">
                                <div>{req.location}</div>
                                <div className="text-xs truncate text-slate-500" title={req.description || ''}>
                                    {req.description}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={req.status === 'completed' ? 'default' : req.status === 'contacted' ? 'secondary' : 'outline'}>
                                    {req.status === 'pending' && '대기중'}
                                    {req.status === 'contacted' && '연락됨'}
                                    {req.status === 'completed' && '완료'}
                                    {!['pending', 'contacted', 'completed'].includes(req.status) && req.status}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
