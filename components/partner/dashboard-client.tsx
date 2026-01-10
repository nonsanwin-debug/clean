'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendQuote } from '@/app/partner/actions'
import { MapPin, Calendar, CheckCircle, DollarSign, Send } from 'lucide-react'

// Types (simplified for demo)
type Request = {
    id: string
    created_at: string
    service_type: string
    location: string
    target_date: string
    sq_ft: string
    status: string
    description: string
    customer_name: string
}

export default function DashboardClient({ requests }: { requests: Request[] }) {
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(requests[0] || null)
    const [price, setPrice] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    const handleSendQuote = async () => {
        if (!selectedRequest) return
        if (!price) {
            alert('견적 금액을 입력해주세요.')
            return
        }

        setSending(true)
        try {
            const result = await sendQuote({
                requestId: selectedRequest.id,
                price: parseInt(price.replace(/,/g, '')), // Remove commas
                message
            })

            if (result.success) {
                alert('견적이 발송되었습니다!')
                setPrice('')
                setMessage('')
            } else {
                alert(result.message)
            }
        } catch (e) {
            alert('오류가 발생했습니다.')
        } finally {
            setSending(false)
        }
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center text-muted-foreground">
                도착한 견적 요청이 없습니다.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Column: Request List */}
            <div className="md:col-span-3 border-r bg-gray-50/50 overflow-y-auto h-full">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <h2 className="font-bold text-lg">받은 요청</h2>
                    <p className="text-xs text-muted-foreground">총 {requests.length}건중 선택</p>
                </div>
                <div className="divide-y">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${selectedRequest?.id === req.id ? 'bg-white border-l-4 border-l-primary shadow-sm' : ''
                                }`}
                            onClick={() => setSelectedRequest(req)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium truncate">{req.customer_name}님 요청</span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {format(new Date(req.created_at), 'MM/dd HH:mm')}
                                </span>
                            </div>
                            <h3 className="font-bold text-primary mb-2">{req.service_type}</h3>
                            <div className="text-sm text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {req.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {req.target_date || '날짜 미정'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Column: Request Detail */}
            <div className="md:col-span-6 border-r overflow-y-auto h-full bg-white p-6">
                {selectedRequest ? (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="border-b pb-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <Badge variant="secondary">{selectedRequest.status === 'pending' ? '매칭중' : selectedRequest.status}</Badge>
                                <span>{format(new Date(selectedRequest.created_at), 'yyyy년 MM월 dd일 요청')}</span>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">{selectedRequest.service_type} 견적 요청</h1>
                            <p className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-4 h-4" /> {selectedRequest.location}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">요청 상세 정보</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 block mb-1">평수/면적</span>
                                    <span className="font-medium">{selectedRequest.sq_ft}평</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 block mb-1">희망 날짜</span>
                                    <span className="font-medium">{selectedRequest.target_date || '협의 가능'}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                                    <span className="text-gray-500 block mb-1">요청 사항</span>
                                    <p className="whitespace-pre-wrap">{selectedRequest.description || '특이사항 없음'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900">고객님 정보</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    이름: {selectedRequest.customer_name}<br />
                                    연락처: {selectedRequest.customer_name === '김용민' ? '010-7602-7436 (안심번호)' : '010-****-**** (안심번호)'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        왼쪽에서 요청을 선택해주세요.
                    </div>
                )}
            </div>

            {/* Right Column: Quote Form */}
            <div className="md:col-span-3 bg-gray-50 h-full p-4 border-l overflow-y-auto">
                {selectedRequest ? (
                    <div className="sticky top-4 space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" /> 견적 보내기
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">예상 견적 금액 (원)</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="예: 350000"
                                            className="pl-8 font-bold text-lg"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₩</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        고객님의 예산 범위 내에서 합리적인 금액을 제안해주세요.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">견적 설명 (선택)</label>
                                    <Textarea
                                        placeholder="견적에 대한 상세 설명이나 어필하고 싶은 내용을 적어주세요."
                                        className="h-32 resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full h-12 text-lg font-bold"
                                    onClick={handleSendQuote}
                                    disabled={sending}
                                >
                                    {sending ? <span className="flex items-center gap-2">보내는 중...</span> : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> 견적서 발송</span>}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                            <strong>💡 견적 발송 팁</strong>
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-xs">
                                <li>상세한 견적 내용을 작성하면 채택 확률이 올라갑니다.</li>
                                <li>비슷한 평수의 평균 견적가는 30~40만원 입니다.</li>
                                <li>고객님은 최대 5개의 견적만 받아볼 수 있습니다.</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm text-center px-4">
                        요청을 선택하면 견적을 보낼 수 있습니다.
                    </div>
                )}
            </div>
        </div>
    )
}
