'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitRequest } from './actions'
import { Loader2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Step = 'service' | 'building' | 'room' | 'bathroom' | 'veranda' | 'features' | 'extras' | 'area' | 'date' | 'location' | 'contact' | 'review'

const QUESTIONS = {
    service: "어떤 서비스를 원하시나요?",
    building: "어떤 건물인가요?",
    room: "방 개수를 선택해주세요.",
    bathroom: "화장실 개수를 선택해주세요.",
    veranda: "베란다 개수를 선택해주세요.",
    features: "해당하는 공간이 있나요? (중복 선택 가능)",
    extras: "추가로 원하시는 서비스가 있나요? (중복 선택 가능)",
    area: "공급면적(평)을 알면 정확한 견적을 받을 수 있어요.",
    date: "청소 희망일은 언제인가요?",
    location: "서비스 받으실 지역(동/읍/면)을 알려주세요.",
    contact: "견적을 받아보실 연락처를 입력해주세요."
}

export default function ChatWizard() {
    const router = useRouter()
    const [history, setHistory] = useState<{ role: 'bot' | 'user', text: string | React.ReactNode }[]>([
        { role: 'bot', text: QUESTIONS.service }
    ])
    const [currentStep, setCurrentStep] = useState<Step>('service')
    const [formData, setFormData] = useState<any>({
        features: [],
        extraServices: []
    })
    const [loading, setLoading] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [history, currentStep])

    const handleAnswer = (key: string, value: any, displayText?: string) => {
        // Update Form Data
        const newData = { ...formData, [key]: value }
        setFormData(newData)

        // Show User Bubble
        setHistory(prev => [...prev, { role: 'user', text: displayText || value.toString() }])

        // Move to Next Step
        const steps: Step[] = ['service', 'building', 'room', 'bathroom', 'veranda', 'features', 'extras', 'area', 'date', 'location', 'contact', 'review']
        const currentIndex = steps.indexOf(currentStep)

        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]
            setTimeout(() => {
                setHistory(prev => [...prev, { role: 'bot', text: QUESTIONS[nextStep as keyof typeof QUESTIONS] || "확인했습니다." }])
                setCurrentStep(nextStep)
            }, 500)
        } else {
            // Final Spec
            handleSubmit(newData)
        }
    }

    const handleSubmit = async (finalData: any) => {
        setLoading(true)
        setHistory(prev => [...prev, { role: 'bot', text: "견적을 요청하고 있습니다..." }])

        try {
            const result = await submitRequest(finalData)
            if (result.success) {
                setHistory(prev => [...prev, { role: 'bot', text: "✅ 요청이 성공적으로 접수되었습니다! 곧 파트너님들의 견적이 도착합니다." }])
                setTimeout(() => router.push('/partner/dashboard'), 2000) // Demo redirect
            } else {
                setHistory(prev => [...prev, { role: 'bot', text: "❌ 오류가 발생했습니다: " + result.message }])
            }
        } catch (e) {
            setHistory(prev => [...prev, { role: 'bot', text: "❌ 서버 오류가 발생했습니다." }])
        } finally {
            setLoading(false)
        }
    }

    // --- Steps UI Components ---

    // 1. Service
    const StepService = () => (
        <div className="flex flex-col gap-2">
            {['이사청소', '입주청소', '거주청소', '부분청소', '기타'].map(opt => (
                <Button key={opt} variant="outline" className="justify-start h-12 text-lg" onClick={() => handleAnswer('serviceType', opt)}>
                    {opt}
                </Button>
            ))}
        </div>
    )

    // 2. Building
    const StepBuilding = () => (
        <div className="grid grid-cols-2 gap-2">
            {['아파트', '빌라/연립', '오피스텔', '단독주택', '원룸', '사무실/상가'].map(opt => (
                <Button key={opt} variant="outline" className="h-12" onClick={() => handleAnswer('buildingType', opt)}>
                    {opt}
                </Button>
            ))}
        </div>
    )

    // 3,4,5. Counts (Generic)
    const StepCount = ({ field, label }: { field: string, label: string }) => (
        <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map(n => (
                <Button key={n} variant="outline" className="justify-start h-12" onClick={() => handleAnswer(field, `${n}개`)}>
                    {n}개
                </Button>
            ))}
            <Button variant="outline" className="justify-start h-12" onClick={() => handleAnswer(field, '없음')}>없음</Button>
        </div>
    )

    // 6. Features (Multi-select)
    const StepFeatures = () => {
        const [selected, setSelected] = useState<string[]>([])
        const options = ['베란다 확장', '복층형 구조', '야외 테라스', '곰팡이 심함']

        const toggle = (opt: string) => {
            if (selected.includes(opt)) setSelected(s => s.filter(x => x !== opt))
            else setSelected(s => [...s, opt])
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {options.map(opt => (
                        <Button
                            key={opt}
                            variant={selected.includes(opt) ? "default" : "outline"}
                            className="h-12"
                            onClick={() => toggle(opt)}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
                <Button className="w-full" onClick={() => handleAnswer('features', selected, selected.length ? selected.join(', ') : '해당 없음')}>
                    {selected.length === 0 ? "해당 없음 (다음)" : "선택 완료"}
                </Button>
            </div>
        )
    }

    // 7. Extras (Multi-select)
    const StepExtras = () => {
        const [selected, setSelected] = useState<string[]>([])
        const options = ['곰팡이 제거', '외부창 청소', '새집증후군', '피톤치드', '스티커 제거']

        const toggle = (opt: string) => {
            if (selected.includes(opt)) setSelected(s => s.filter(x => x !== opt))
            else setSelected(s => [...s, opt])
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {options.map(opt => (
                        <Button
                            key={opt}
                            variant={selected.includes(opt) ? "default" : "outline"}
                            className="h-12"
                            onClick={() => toggle(opt)}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
                <Button className="w-full" onClick={() => handleAnswer('extraServices', selected, selected.length ? selected.join(', ') : '필요 없음')}>
                    {selected.length === 0 ? "필요 없음 (다음)" : "선택 완료"}
                </Button>
            </div>
        )
    }

    // 8. Area
    const StepArea = () => {
        const [val, setVal] = useState('')
        return (
            <div className="flex gap-2">
                <Input type="number" placeholder="예: 24" value={val} onChange={e => setVal(e.target.value)} className="h-12 text-lg" autoFocus />
                <Button className="h-12 px-6" onClick={() => val && handleAnswer('sqFt', val, `${val}평`)}>입력</Button>
            </div>
        )
    }

    // 9. Date
    const StepDate = () => (
        <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start h-12" onClick={() => handleAnswer('dateType', '날짜 협의 가능')}>협의 가능해요</Button>
            <Button variant="outline" className="justify-start h-12" onClick={() => handleAnswer('dateType', '가능한 빨리')}>가능한 빨리</Button>
            <div className="flex gap-2">
                <Input type="date" className="h-12" onChange={(e) => {
                    if (e.target.value) handleAnswer('date', e.target.value, e.target.value)
                }} />
            </div>
        </div>
    )

    // 10. Location
    const StepLocation = () => {
        const [val, setVal] = useState('')
        return (
            <div className="flex gap-2">
                <Input placeholder="예: 서울 강남구 역삼동" value={val} onChange={e => setVal(e.target.value)} className="h-12 text-lg" autoFocus />
                <Button className="h-12 px-6" onClick={() => val && handleAnswer('location', val)}>입력</Button>
            </div>
        )
    }

    // 11. Contact (Final)
    const StepContact = () => {
        const [name, setName] = useState('')
        const [phone, setPhone] = useState('')
        return (
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                <Input placeholder="이름" value={name} onChange={e => setName(e.target.value)} className="bg-white" />
                <Input placeholder="휴대폰 번호 (-없이 입력)" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white" />
                <Button className="w-full" disabled={!name || !phone} onClick={() => {
                    setFormData((prev: any) => ({ ...prev, name, phone }))
                    handleSubmit({ ...formData, name, phone })
                }}>
                    견적 요청하기
                </Button>
            </div>
        )
    }


    return (
        <div className="max-w-md mx-auto h-[calc(100vh-64px)] flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="h-14 border-b flex items-center justify-center font-bold bg-white z-10">
                AI 스마트 견적
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {history.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-[#7353EA] text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}

                {/* Input Area (Dynamic) */}
                {!loading && (
                    <div className="mt-4 pb-4">
                        {currentStep === 'service' && <StepService />}
                        {currentStep === 'building' && <StepBuilding />}
                        {currentStep === 'room' && <StepCount field="roomCount" label="방" />}
                        {currentStep === 'bathroom' && <StepCount field="bathroomCount" label="화장실" />}
                        {currentStep === 'veranda' && <StepCount field="verandaCount" label="베란다" />}
                        {currentStep === 'features' && <StepFeatures />}
                        {currentStep === 'extras' && <StepExtras />}
                        {currentStep === 'area' && <StepArea />}
                        {currentStep === 'date' && <StepDate />}
                        {currentStep === 'location' && <StepLocation />}
                        {currentStep === 'contact' && <StepContact />}
                    </div>
                )}
                <div ref={endRef} />
            </div>
        </div>
    )
}
