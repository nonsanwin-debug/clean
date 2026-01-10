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
    customer_phone: string
    // Detailed fields
    building_type?: string
    room_count?: string
    bathroom_count?: string
    veranda_count?: string
    features?: string[]
    extra_services?: string[]
    max_quotes?: number
}

// ...

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
                <span className="text-gray-500 block mb-1">건물 유형</span>
                <span className="font-medium">{selectedRequest.building_type || '-'}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block mb-1">평수/면적</span>
                <span className="font-medium">{selectedRequest.sq_ft}평</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block mb-1">구조 (방/화장실/베란다)</span>
                <span className="font-medium">
                    방 {selectedRequest.room_count || 0}, 화장실 {selectedRequest.bathroom_count || 0}, 베란다 {selectedRequest.veranda_count || 0}
                </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block mb-1">희망 날짜</span>
                <span className="font-medium">{selectedRequest.target_date || '협의 가능'}</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <span className="text-gray-500 block mb-1">특이 사항 (Features)</span>
                <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRequest.features && selectedRequest.features.length > 0
                        ? selectedRequest.features.map((f, i) => <Badge key={i} variant="outline" className="bg-white">{f}</Badge>)
                        : <span className="text-gray-400">없음</span>
                    }
                </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <span className="text-gray-500 block mb-1">추가 요청 서비스</span>
                <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRequest.extra_services && selectedRequest.extra_services.length > 0
                        ? selectedRequest.extra_services.map((f, i) => <Badge key={i} variant="secondary">{f}</Badge>)
                        : <span className="text-gray-400">없음</span>
                    }
                </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <span className="text-gray-500 block mb-1">추가 설명</span>
                <p className="whitespace-pre-wrap">{selectedRequest.description || '특이사항 없음'}</p>
            </div>
        </div>
    </div>

    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
            <h4 className="font-bold text-blue-900">고객님 정보 (안심보호)</h4>
            <p className="text-sm text-blue-700 mt-1">
                이름: {selectedRequest.customer_name.slice(0, 1)}**<br />
                연락처: 010-****-**** (견적 발송 시 연결됨)
            </p>
        </div>
    </div>
</div>
                ) : (
    <div className="flex h-full items-center justify-center text-gray-400">
        왼쪽에서 요청을 선택해주세요.
    </div>
)}
            </div >

    {/* Right Column: Quote Form */ }
    < div className = "md:col-span-3 bg-gray-50 h-full p-4 border-l overflow-y-auto" >
    {
        selectedRequest?(
                    <div className = "sticky top-4 space-y-4" >
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
            </div >
        </div >
    )
}
