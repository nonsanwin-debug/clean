'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
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
        <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-64px)] overflow-hidden bg-[#F3F5F7]">
            {/* Left Column: Request List */}
            <div className="md:col-span-3 bg-white overflow-y-auto h-full flex flex-col">
                <div className="p-5 bg-white sticky top-0 z-10">
                    <h2 className="font-bold text-xl text-gray-900">받은 요청함</h2>
                    <p className="text-sm text-gray-400 mt-1">총 {requests.length}개의 새로운 요청이 있습니다.</p>
                </div>
                <div className="p-4 space-y-3 bg-[#F8FAFC]">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm relative group overflow-hidden ${selectedRequest?.id === req.id
                                ? 'bg-white ring-2 ring-[#7353EA] shadow-[0_4px_20px_rgba(115,83,234,0.15)] z-10'
                                : 'bg-white hover:bg-gray-50 border border-transparent'
                                }`}
                            onClick={() => setSelectedRequest(req)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className={`${req.status === 'pending'
                                    ? 'bg-[#EFEBFF] text-[#7353EA] hover:bg-[#EFEBFF]'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                                    } border-none`}>
                                    {req.status === 'pending' ? '매칭중' : req.status}
                                </Badge>
                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                    {format(new Date(req.created_at), 'MM/dd HH:mm')}
                                </span>
                            </div>
                            <h3 className={`font-bold text-lg mb-2 transition-colors ${selectedRequest?.id === req.id ? 'text-[#7353EA]' : 'text-gray-900'}`}>{req.service_type}</h3>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="truncate">{req.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{req.target_date || '날짜 미정'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Column: Request Detail (Enhanced Design) */}
            <div className="md:col-span-6 overflow-y-auto h-full bg-[#F3F5F7] p-8 custom-scrollbar">
                {selectedRequest ? (
                    <div className="max-w-3xl mx-auto space-y-6 pb-10">
                        {/* Header Section */}
                        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-none">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="px-2.5 py-0.5 rounded-full bg-[#EFEBFF] text-[#7353EA] text-[11px] font-bold">
                                    {selectedRequest.service_type}
                                </div>
                                <span className="text-gray-300 text-[11px] font-mono">
                                    ID: {selectedRequest.id.slice(0, 8)}
                                </span>
                            </div>
                            <h1 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">
                                {selectedRequest.sq_ft}평 {selectedRequest.building_type || '건물'} 청소 견적 요청
                            </h1>
                            <p className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                <MapPin className="w-4 h-4 text-gray-300" />
                                {selectedRequest.location}
                            </p>
                        </div>

                        {/* Customer Info Card (Clean & App-like) */}
                        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4">
                                <User className="w-24 h-24 text-gray-900" />
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-[#7353EA]" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 text-xs font-medium mb-0.5">견적 요청 고객</h3>
                                    <p className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                        {selectedRequest.customer_name} 고객님
                                    </p>
                                    <p className="text-gray-500 flex items-center gap-1.5 text-xs mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {selectedRequest.location} 거주
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detail Grid */}
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full bg-[#7353EA]"></span>
                                상세 요청 정보
                            </h3>
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

                                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] col-span-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-50 rounded-xl">
                                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">추가 요청 서비스</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.extra_services?.length ? (
                                            selectedRequest.extra_services.map((f, i) => (
                                                <Badge key={i} variant="secondary" className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border-none rounded-xl text-sm font-medium">
                                                    {f}
                                                </Badge>
                                            ))
                                        ) : <span className="text-gray-400 text-sm">없음</span>}
                                    </div>
                                </div>

                                <DetailCard
                                    icon={<Calendar className="w-5 h-5 text-green-500" />}
                                    label="희망 서비스 날짜"
                                    value={selectedRequest.target_date || '날짜 협의 가능'}
                                />

                                <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-center">
                                    <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-orange-400" />
                                        특이사항
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.features?.length ? (
                                            selectedRequest.features.map((f, i) => (
                                                <Badge key={i} variant="outline" className="text-xs bg-gray-50 px-3 py-1.5 border-none text-gray-600 font-medium">
                                                    {f}
                                                </Badge>
                                            ))
                                        ) : <span className="font-bold text-gray-700 text-sm">없음</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                <span className="w-1 h-4 rounded-full bg-gray-200"></span>
                                고객 추가 전달사항
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed font-medium">
                                    {selectedRequest.description || "특별히 남기신 내용이 없습니다."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 flex-col">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Layers className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">왼쪽 목록에서 요청을 선택해주세요</p>
                    </div>
                )}
            </div>

            {/* Right Column: Work Area */}
            <div className="md:col-span-3 bg-white h-full flex flex-col shadow-2xl z-20">
                {selectedRequest ? (
                    <div className="flex flex-col h-full bg-white">
                        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                                <DollarSign className="w-5 h-5 text-[#7353EA]" />
                                견적서 작성
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">고객님께 제안할 금액을 입력해주세요.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-900">총 예상 금액 (VAT 포함)</label>
                                    <div className="relative transform transition-all focus-within:scale-[1.01]">
                                        <Input
                                            type="text"
                                            placeholder="0"
                                            className="h-12 pl-8 font-bold text-xl border-gray-100 bg-gray-50 focus:bg-[#F8F7FF] focus:border-[#7353EA] focus:ring-0 transition-all rounded-xl"
                                            value={price}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setPrice(val ? parseInt(val).toLocaleString() : '');
                                            }}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₩</span>
                                    </div>
                                    <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-blue-600" />
                                        평균 시세: 350,000원 ~ 400,000원
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-900">견적 상세 설명 (어필하기)</label>
                                    <Textarea
                                        placeholder={`예시)\n안녕하세요, 친환경 세제만을 사용하는 청소마스터입니다.\n곰팡이 제거 무료 서비스 포함 위 가격으로 진행 가능합니다.`}
                                        className="h-40 resize-none p-4 text-sm border-gray-100 bg-gray-50 focus:bg-white focus:border-[#7353EA] transition-all leading-relaxed rounded-xl"
                                        value={message}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 backdrop-blur pb-6">
                            <Button
                                className="w-full h-12 text-base font-bold bg-[#7353EA] hover:bg-[#6244C5] transition-all shadow-lg shadow-indigo-200 rounded-xl"
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
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm p-8 text-center bg-gray-50/50">
                        선택된 요청이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}

function DetailCard({ icon, label, value, className = '' }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
    return (
        <div className={`bg-white p-4 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-start gap-3 ${className}`}>
            <div className="p-2.5 bg-gray-50 rounded-xl shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                <p className="text-gray-900 font-bold text-base tracking-tight">{value}</p>
            </div>
        </div>
    )
}
