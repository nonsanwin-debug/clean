'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendQuote } from '@/app/partner/actions'
import {
    MapPin, Calendar, CheckCircle2, DollarSign, Send,
    Home, Maximize2, Layers, AlertCircle, User, Phone
} from 'lucide-react'

// Types
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
    building_type?: string
    room_count?: string
    bathroom_count?: string
    veranda_count?: string
    features?: string[]
    extra_services?: string[]
    max_quotes?: number
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
                price: parseInt(price.replace(/,/g, '')),
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
            <div className="flex h-[80vh] items-center justify-center text-muted-foreground flex-col gap-4">
                <div className="bg-gray-100 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg">도착한 견적 요청이 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* Left Column: Request List */}
            <div className="md:col-span-3 border-r bg-slate-50/50 overflow-y-auto h-full flex flex-col">
                <div className="p-5 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
                    <h2 className="font-bold text-xl text-slate-900">받은 요청함</h2>
                    <p className="text-sm text-slate-500 mt-1">총 {requests.length}개의 새로운 요청이 있습니다.</p>
                </div>
                <div className="p-4 space-y-3">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border relative group ${selectedRequest?.id === req.id
                                    ? 'bg-white border-[#7353EA] shadow-md ring-1 ring-[#7353EA]/20'
                                    : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                                }`}
                            onClick={() => setSelectedRequest(req)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={req.status === 'pending' ? 'default' : 'secondary'} className={`${req.status === 'pending' ? 'bg-[#7353EA] hover:bg-[#7353EA]/90' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}>
                                    {req.status === 'pending' ? '매칭중' : req.status}
                                </Badge>
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                    {format(new Date(req.created_at), 'MM/dd HH:mm')}
                                </span>
                            </div>
                            <h3 className={`font-bold text-lg mb-2 transition-colors ${selectedRequest?.id === req.id ? 'text-[#7353EA]' : 'text-slate-900'}`}>{req.service_type}</h3>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{req.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{req.target_date || '날짜 미정'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Column: Request Detail (Enhanced Design) */}
            <div className="md:col-span-6 overflow-y-auto h-full bg-[#f8f9fc] p-8">
                {selectedRequest ? (
                    <div className="max-w-3xl mx-auto space-y-8 pb-10">
                        {/* Header Section */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="px-3 py-1 border-[#7353EA] text-[#7353EA] bg-[#7353EA]/5">
                                    {selectedRequest.service_type}
                                </Badge>
                                <span className="text-slate-400 text-sm">
                                    요청번호 #{selectedRequest.id.slice(0, 8)}
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                                {selectedRequest.sq_ft}평 {selectedRequest.building_type || '건물'} 청소 견적 요청
                            </h1>
                            <p className="flex items-center gap-2 text-slate-500 text-lg">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                {selectedRequest.location}
                            </p>
                        </div>

                        {/* Customer Info Card (Privacy Protected) */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CheckCircle2 className="w-32 h-32 text-[#7353EA]" />
                            </div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">고객 정보 (안심 보호 중)</h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-slate-600 flex items-center gap-2">
                                            <span className="font-medium text-slate-900">{selectedRequest.customer_name.slice(0, 1)}** 고객님</span>
                                        </p>
                                        <p className="text-blue-600 font-medium flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg w-fit">
                                            <Phone className="w-3.5 h-3.5" />
                                            010-****-**** (견적 발송 시 연결)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Grid */}
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-4">상세 요청 정보</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailCard
                                    icon={<Home className="w-5 h-5 text-[#7353EA]" />}
                                    label="건물 유형"
                                    value={selectedRequest.building_type || '-'}
                                />
                                <DetailCard
                                    icon={<Maximize2 className="w-5 h-5 text-blue-500" />}
                                    label="평수 (공급면적)"
                                    value={`${selectedRequest.sq_ft}평`}
                                />
                                <DetailCard
                                    icon={<Layers className="w-5 h-5 text-orange-500" />}
                                    label="내부 구조"
                                    value={`방 ${selectedRequest.room_count || 0} · 화장실 ${selectedRequest.bathroom_count || 0} · 베란다 ${selectedRequest.veranda_count || 0}`}
                                    className="col-span-2"
                                />

                                {/* Moved Up & Full Width */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h4 className="font-bold text-slate-700">추가 요청 서비스</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.extra_services?.length ? (
                                            selectedRequest.extra_services.map((f, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100">
                                                    {f}
                                                </Badge>
                                            ))
                                        ) : <span className="text-slate-400 text-sm">없음</span>}
                                    </div>
                                </div>

                                <DetailCard
                                    icon={<Calendar className="w-5 h-5 text-green-500" />}
                                    label="희망 서비스 날짜"
                                    value={selectedRequest.target_date || '날짜 협의 가능'}
                                />

                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                                    <p className="text-sm text-slate-500 font-medium mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-400" />
                                        특이사항
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.features?.length ? (
                                            selectedRequest.features.map((f, i) => (
                                                <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                                                    {f}
                                                </Badge>
                                            ))
                                        ) : <span className="font-bold text-slate-900">없음</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">고객 추가 전달사항</h4>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                {selectedRequest.description || "특별히 남기신 내용이 없습니다."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 flex-col">
                        <Layers className="w-16 h-16 mb-4 text-slate-200" />
                        <p>왼쪽 목록에서 요청을 선택하여 상세 내용을 확인하세요.</p>
                    </div>
                )}
            </div>

            {/* Right Column: Work Area */}
            <div className="md:col-span-3 bg-white border-l h-full flex flex-col shadow-xl z-20">
                {selectedRequest ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                                <DollarSign className="w-5 h-5 text-[#7353EA]" />
                                견적서 작성
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">고객님께 보낼 합리적인 금액을 제안하세요.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">총 예상 금액 (VAT 포함)</label>
                                    <div className="relative transform transition-all focus-within:scale-[1.02]">
                                        <Input
                                            type="text"
                                            placeholder="0"
                                            className="h-14 pl-10 font-bold text-2xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                                            value={price}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setPrice(val ? parseInt(val).toLocaleString() : '');
                                            }}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-medium">₩</span>
                                    </div>
                                    <p className="text-xs text-blue-600 font-medium">
                                        * 평균 시세: 350,000원 ~ 400,000원
                                    </p>
                                </div>

                                <div className="h-px bg-slate-100 my-4" />

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">견적 상세 설명 (어필하기)</label>
                                    <Textarea
                                        placeholder={`예시)\n안녕하세요, 친환경 세제만을 사용하는 청소마스터입니다.\n곰팡이 제거 무료 서비스 포함 위 가격으로 진행 가능합니다.`}
                                        className="h-48 resize-none p-4 text-base border-slate-200 bg-slate-50 focus:bg-white transition-colors leading-relaxed"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-slate-50">
                            <Button
                                className="w-full h-14 text-lg font-bold bg-[#7353EA] hover:bg-[#7353EA]/90 transition-all shadow-lg shadow-indigo-200"
                                onClick={handleSendQuote}
                                disabled={sending}
                            >
                                {sending ? (
                                    <span className="flex items-center gap-2">발송 중...</span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-5 h-5" /> 견적서 무료 발송하기
                                    </span>
                                )}
                            </Button>
                            <p className="text-xs text-center text-slate-400 mt-3">
                                고객님이 견적을 확정하면 연락처가 공개됩니다.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 text-sm p-8 text-center bg-slate-50">
                        선택된 요청이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}

function DetailCard({ icon, label, value, className = '' }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
    return (
        <div className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 ${className}`}>
            <div className="p-2.5 bg-slate-50 rounded-xl shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                <p className="text-slate-900 font-bold text-lg">{value}</p>
            </div>
        </div>
    )
}
