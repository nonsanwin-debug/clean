import WizardForm from "@/components/request/wizard-form";

export default function RequestPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-2xl">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">무료 견적 요청하기</h1>
                    <p className="text-muted-foreground">
                        몇 가지 질문에 답해주시면 딱 맞는 전문가를 연결해 드립니다.
                    </p>
                </div>

                <WizardForm />
            </div>
        </div>
    );
}
