import BeforeAfterSlider from "@/components/home/before-after-slider";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">

            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                ✨ 프리미엄 청소 서비스
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-slate-900 dark:text-white">
                청소의 차이가<br />
                <span className="text-primary">공간의 품격</span>을 만듭니다
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
                검증된 전문가의 손길로 완성되는 완벽한 공간.
                숨고보다 더 확실한 청소 전문 플랫폼에서 무료 견적을 받아보세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/request">
                  <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto gap-2">
                    무료 견적 받기 <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                  서비스 알아보기
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>검증된 파트너</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>100% A/S 보장</span>
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
              <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <BeforeAfterSlider />

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl rounded-full px-6 py-2 flex items-center gap-2 whitespace-nowrap z-20">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden">
                        User
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-semibold">
                    <span className="text-primary">4.9/5</span> 만족도 (1,230+)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">어떤 서비스가 필요하신가요?</h2>
            <p className="text-muted-foreground">주거 공간부터 상업 공간까지 맞춤형 솔루션을 제공합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "입주/이사 청소", desc: "새 집처럼 깨끗하게, 묵은 때 완벽 제거", icon: ShieldCheck },
              { title: "거주/부분 청소", desc: "살고 있는 집도 짐 정리부터 깔끔하게", icon: Star },
              { title: "상가/오피스 청소", desc: "업무 효율을 높이는 쾌적한 사무실 관리", icon: Clock },
            ].map((service, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
