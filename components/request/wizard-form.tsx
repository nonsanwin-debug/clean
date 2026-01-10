'use client'
// Updated Region Selector and Contact Form

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitRequest } from '@/app/request/actions'
import { Loader2, Send } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

type Step = 'service' | 'building' | 'room' | 'bathroom' | 'veranda' | 'features' | 'extras' | 'area' | 'date' | 'location' | 'maxQuotes' | 'contact' | 'review'

const KOREA_REGIONS: { [key: string]: string[] } = {
    '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '경기': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
    '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
    '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
    '대구': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군', '군위군'],
    '광주': ['동구', '서구', '남구', '북구', '광산구'],
    '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
    '울산': ['중구', '남구', '동구', '북구', '울주군'],
    '세종': ['세종시'],
    '강원': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충북': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충남': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '전북': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전남': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '경북': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경남': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    '제주': ['제주시', '서귀포시']
}

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
    maxQuotes: "몇 군데 업체의 견적을 받고 싶으신가요?",
    contact: "견적을 받아보실 연락처를 입력해주세요."
}

export default function ChatWizard() {
    const router = useRouter()
    const [history, setHistory] = useState<{ role: 'bot' | 'user', text: string | React.ReactNode, step?: Step }[]>([
        { role: 'bot', text: QUESTIONS.service, step: 'service' }
    ])
    const [currentStep, setCurrentStep] = useState<Step>('service')
    const [formData, setFormData] = useState<any>({
        features: [],
        extraServices: []
    })
    const [loading, setLoading] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams()
    const autoSelected = useRef(false)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [history, currentStep])

    useEffect(() => {
        const category = searchParams.get('category')
        if (category && !autoSelected.current && currentStep === 'service') {
            autoSelected.current = true
            // Use a small timeout to make it feel natural after load
            setTimeout(() => {
                handleAnswer('serviceType', category)
            }, 600)
        }
    }, [searchParams, currentStep])

    const jumpToStep = (targetStep: Step) => {
        // 1. Set the current step back to the target
        setCurrentStep(targetStep)

        // 2. Rewind history: Keep everything UP TO the bot's question for this step
        // We find the index of the first message where (role='bot' AND step=targetStep)
        // And we keep that message, but discard everything after (including the user's previous answer)
        const targetIndex = history.findIndex(msg => msg.role === 'bot' && msg.step === targetStep)

        if (targetIndex !== -1) {
            setHistory(prev => prev.slice(0, targetIndex + 1))
        }
    }

    const handleAnswer = (key: string, value: any, displayText?: string) => {
        // Update Form Data
        const newData = { ...formData, [key]: value }
        setFormData(newData)

        // Show User Bubble with current step tag
        setHistory(prev => [...prev, { role: 'user', text: displayText || value.toString(), step: currentStep }])

        // Move to Next Step
        const steps: Step[] = ['service', 'building', 'room', 'bathroom', 'veranda', 'features', 'extras', 'area', 'date', 'location', 'maxQuotes', 'contact', 'review']
        const currentIndex = steps.indexOf(currentStep)

        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]
            setTimeout(() => {
                setHistory(prev => [...prev, { role: 'bot', text: QUESTIONS[nextStep as keyof typeof QUESTIONS] || "확인했습니다.", step: nextStep }])
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

    // Shared Button Style
    const OptionButton = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) => (
        <Button
            variant="ghost"
            className={`
                h-14 text-lg justify-start px-6 rounded-xl border-2 transition-all duration-200
                ${active
                    ? 'border-[#7353EA] bg-[#F0EBFF] text-[#7353EA] font-bold shadow-sm'
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-[1.02]'
                }
            `}
            onClick={onClick}
        >
            {children}
        </Button>
    )

    // 1. Service
    const StepService = () => (
        <div className="flex flex-col gap-3">
            {['입주청소', '거주청소', '가전/가구', '사업장', '특수청소', '이사청소', '기타'].map(opt => (
                <OptionButton key={opt} onClick={() => handleAnswer('serviceType', opt)}>
                    {opt}
                </OptionButton>
            ))}
        </div>
    )

    // 2. Building
    const StepBuilding = () => (
        <div className="grid grid-cols-2 gap-3">
            {['아파트', '빌라/연립', '오피스텔', '단독주택', '원룸', '사무실/상가'].map(opt => (
                <Button
                    key={opt}
                    variant="ghost"
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-xl hover:bg-[#F0EBFF] hover:text-[#7353EA] hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-[#7353EA]"
                    onClick={() => handleAnswer('buildingType', opt)}
                >
                    <span className="text-lg font-bold">{opt}</span>
                </Button>
            ))}
        </div>
    )

    // 3,4,5. Counts (Generic)
    const StepCount = ({ field }: { field: string }) => (
        <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5].map(n => (
                <Button
                    key={n}
                    variant="ghost"
                    className="h-16 text-xl font-bold bg-gray-50 rounded-xl hover:bg-[#F0EBFF] hover:text-[#7353EA] border-2 border-transparent hover:border-[#7353EA] transition-all"
                    onClick={() => handleAnswer(field, `${n}개`)}
                >
                    {n}개
                </Button>
            ))}
            <Button
                variant="ghost"
                className="h-16 text-lg font-medium bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-500"
                onClick={() => handleAnswer(field, '없음')}
            >
                없음
            </Button>
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
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {options.map(opt => (
                        <Button
                            key={opt}
                            variant="ghost"
                            className={`h-24 text-lg font-bold rounded-xl border-2 transition-all ${selected.includes(opt)
                                ? 'border-[#7353EA] bg-[#F0EBFF] text-[#7353EA]'
                                : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => toggle(opt)}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
                <Button className="w-full h-14 text-lg bg-[#7353EA] hover:bg-[#7353EA]/90" onClick={() => handleAnswer('features', selected, selected.length ? selected.join(', ') : '해당 없음')}>
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
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {options.map(opt => (
                        <Button
                            key={opt}
                            variant="ghost"
                            className={`h-16 text-md font-bold rounded-xl border-2 transition-all ${selected.includes(opt)
                                ? 'border-[#7353EA] bg-[#F0EBFF] text-[#7353EA]'
                                : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => toggle(opt)}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
                <Button className="w-full h-14 text-lg bg-[#7353EA] hover:bg-[#7353EA]/90" onClick={() => handleAnswer('extraServices', selected, selected.length ? selected.join(', ') : '필요 없음')}>
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
        <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start h-14 text-lg rounded-xl" onClick={() => handleAnswer('dateType', '날짜 협의 가능')}>협의 가능해요</Button>
            <Button variant="outline" className="justify-start h-14 text-lg rounded-xl" onClick={() => handleAnswer('dateType', '가능한 빨리')}>가능한 빨리</Button>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">
                    📅 직접 날짜 선택
                </div>
                <Input
                    type="date"
                    className="h-14 text-lg pl-36 rounded-xl bg-white"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                        if (e.target.value) handleAnswer('date', e.target.value, e.target.value)
                    }}
                />
            </div>
        </div>
    )

    // 10. Location (Hierarchical)
    const StepLocation = () => {
        const [province, setProvince] = useState<string>('')

        if (!province) {
            return (
                <div className="grid grid-cols-3 gap-2">
                    {Object.keys(KOREA_REGIONS).map(r => (
                        <Button key={r} variant="outline" className="h-12" onClick={() => setProvince(r)}>
                            {r}
                        </Button>
                    ))}
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => setProvince('')} className="px-2">
                        ← 뒤로
                    </Button>
                    <span className="font-bold text-lg">{province}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                    {KOREA_REGIONS[province].map(city => (
                        <Button
                            key={city}
                            variant="outline"
                            className="h-12 justify-start px-4"
                            onClick={() => handleAnswer('location', `${province} ${city}`)}
                        >
                            {city}
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    // 11. Contact (Final)
    const StepContact = () => {
        const [name, setName] = useState('')
        const [phone, setPhone] = useState('')
        return (
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-bold text-lg text-center mb-4">견적을 받아보실 연락처를 남겨주세요</h3>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">이름</label>
                        <Input
                            placeholder="고객님 성함"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-white h-12"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">연락처</label>
                        <Input
                            placeholder="010-0000-0000"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="bg-white h-12"
                        />
                    </div>
                </div>
                <Button
                    className="w-full h-14 text-lg font-bold bg-[#7353EA] hover:bg-[#7353EA]/90 mt-4"
                    disabled={!name || !phone}
                    onClick={() => {
                        setFormData((prev: any) => ({ ...prev, name, phone }))
                        handleSubmit({ ...formData, name, phone })
                    }}
                >
                    무료 견적 요청하기
                </Button>
                <p className="text-xs text-center text-gray-400 mt-2">
                    입력하신 정보는 견적 발송을 위해서만 사용됩니다.
                </p>
            </div>
        )
    }

    // New Step: Max Quotes
    const StepMaxQuotes = () => (
        <div className="flex flex-col gap-2">
            {[3, 5, 7, 10].map(n => (
                <Button key={n} variant="outline" className="justify-start h-12" onClick={() => handleAnswer('maxQuotes', n, `${n}군데`)}>
                    최대 {n}군데 견적 받기
                </Button>
            ))}
        </div>
    )


    return (
        <div className="max-w-md mx-auto h-[calc(100vh-64px)] flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="h-14 border-b flex items-center justify-center font-bold bg-white z-10">
                AI 스마트 견적 (비회원 가능)
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
                {history.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`max-w-[85%] px-5 py-3 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                            ? 'bg-[#7353EA] text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white border text-gray-800 rounded-2xl rounded-tl-sm'
                            }`}>
                            {msg.text}
                        </div>
                        {msg.role === 'user' && msg.step && currentStep !== msg.step && (
                            <button
                                onClick={() => jumpToStep(msg.step!)}
                                className="text-xs text-gray-400 underline mt-2 mr-1 hover:text-[#7353EA] transition-colors"
                            >
                                수정
                            </button>
                        )}
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
                        {currentStep === 'room' && <StepCount field="roomCount" />}
                        {currentStep === 'bathroom' && <StepCount field="bathroomCount" />}
                        {currentStep === 'veranda' && <StepCount field="verandaCount" />}
                        {currentStep === 'features' && <StepFeatures />}
                        {currentStep === 'extras' && <StepExtras />}
                        {currentStep === 'area' && <StepArea />}
                        {currentStep === 'date' && <StepDate />}
                        {currentStep === 'location' && <StepLocation />}
                        {currentStep === 'maxQuotes' && <StepMaxQuotes />}
                        {currentStep === 'contact' && <StepContact />}
                    </div>
                )}
                <div ref={endRef} />
            </div>
        </div>
    )
}
