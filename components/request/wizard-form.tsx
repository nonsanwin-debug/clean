"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, ChevronLeft, Check, Home, Building2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitRequest } from "@/app/request/actions"
import { useRouter } from "next/navigation"

type FormData = {
    serviceType: 'move_in' | 'residence' | 'commercial';
    sqFt: string;
    date: string;
    location: string;
    description: string;
    name: string;
    phone: string;
}

const steps = [
    { id: 1, title: "서비스 선택" },
    { id: 2, title: "세부 정보" },
    { id: 3, title: "위치 및 일정" },
    { id: 4, title: "완료" },
]

export default function WizardForm() {
    const [currentStep, setCurrentStep] = React.useState(1)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>()
    const router = useRouter()

    const serviceType = watch("serviceType")

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            const result = await submitRequest(data)

            if (result.success) {
                alert(result.message)
                router.push('/') // Redirect to home or a success page
            } else {
                alert(result.message || "오류가 발생했습니다.")
            }
        } catch (error) {
            console.error(error)
            alert("요청 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b">
                <div className="flex justify-between mb-2">
                    {steps.map((step) => (
                        <div key={step.id} className={cn("text-xs font-bold uppercase tracking-wider", currentStep >= step.id ? "text-primary" : "text-muted-foreground")}>
                            Step {step.id}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 min-h-[400px] flex flex-col justify-between">
                <AnimatePresence mode="wait">

                    {/* Step 1: Service Type */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">어떤 청소가 필요하신가요?</h2>
                            <div className="grid gap-4">
                                {[
                                    { id: 'move_in', label: '입주/이사 청소', icon: Home, desc: '새 집으로 이사갈 때 필수' },
                                    { id: 'residence', label: '거주 청소', icon: Sparkles, desc: '현재 살고 있는 집 대청소' },
                                    { id: 'commercial', label: '상가/사무실', icon: Building2, desc: '매장, 사무실 정기 관리' },
                                ].map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800",
                                            serviceType === item.id ? "border-primary bg-blue-50/50 dark:bg-blue-900/20" : "border-transparent bg-slate-100 dark:bg-slate-800"
                                        )}
                                        onClick={() => setValue("serviceType", item.id as any)}
                                    >
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4", serviceType === item.id ? "bg-primary text-white" : "bg-white text-slate-400 dark:bg-slate-700")}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{item.label}</div>
                                            <div className="text-muted-foreground text-sm">{item.desc}</div>
                                        </div>
                                        {serviceType === item.id && <Check className="ml-auto text-primary" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">상세 정보를 입력해주세요</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">평수 (공급면적) - 숫자만 입력</label>
                                    <Input type="number" placeholder="예: 34" {...register("sqFt", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">희망 날짜</label>
                                    <Input type="date" {...register("date", { required: true })} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">위치를 알려주세요</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">지역 (시/군/구)</label>
                                    <Input placeholder="예: 서울시 강남구" {...register("location", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">상세 내용 / 요청사항</label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="특이사항이나 집중적으로 청소가 필요한 곳을 적어주세요."
                                        {...register("description")}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Contact & Submit */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">연락처를 입력해주세요</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">이름</label>
                                    <Input placeholder="홍길동" {...register("name", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">연락처</label>
                                    <Input placeholder="010-1234-5678" {...register("phone", { required: true })} />
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg text-sm text-muted-foreground mt-4">
                                견적 요청 시 여러 업체로부터 제안을 받게 됩니다. 개인정보는 견적 상담 목적으로만 사용됩니다.
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> 이전
                    </Button>

                    {currentStep < steps.length ? (
                        <Button type="button" onClick={nextStep}>
                            다음 <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                            {isSubmitting ? "제출 중..." : "견적 요청하기"}
                        </Button>
                    )}
                </div>

            </form>
        </div>
    )
}
