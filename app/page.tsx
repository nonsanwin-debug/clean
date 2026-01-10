import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Truck, PaintBucket, Sparkles, Building2, CalendarDays, Wallet, UserCheck } from "lucide-react";

export default function HomePage() {
  const services = [
    { name: "입주청소", icon: Home, color: "text-green-600", bg: "bg-green-100" },
    { name: "거주청소", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "가전/가구", icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "사업장", icon: Building2, color: "text-orange-600", bg: "bg-orange-100" },
    { name: "특수청소", icon: PaintBucket, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center bg-white">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
          더 나은 생활을 위한 변화
        </h1>

        <div className="max-w-2xl mx-auto relative mb-12">
          <Input
            className="h-14 pl-12 rounded-full shadow-lg border-none bg-white text-lg"
            placeholder="어떤 서비스가 필요하세요?"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <Button className="absolute right-2 top-2 rounded-full h-10 px-6 font-bold bg-[#7353EA] hover:bg-[#7353EA]/90">
            AI 견적 요청
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {services.map((service, idx) => (
            <Link href={`/request?category=${service.name}`} key={idx} className="flex flex-col items-center gap-2 group cursor-pointer p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-6 h-6 ${service.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{service.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">지금 필요한 서비스, 한번에 견적 받기</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-lg mb-2">새집처럼 만드는<br />종합 인테리어</h3>
              <p className="text-sm text-gray-500 mb-4">시공 서비스 9종</p>
              <div className="flex justify-end">
                <Home className="w-16 h-16 text-blue-100" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-lg mb-2">곰팡이 걱정 없는<br />쾌적한 욕실</h3>
              <p className="text-sm text-gray-500 mb-4">청소 서비스 5종</p>
              <div className="flex justify-end">
                <Sparkles className="w-16 h-16 text-purple-100" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-lg mb-2">먼지 없는 사무실<br />정기 청소</h3>
              <p className="text-sm text-gray-500 mb-4">기업 전용 서비스</p>
              <div className="flex justify-end">
                <Building2 className="w-16 h-16 text-orange-100" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-bold text-lg mb-2">합리적인 비용<br />이사 청소</h3>
              <p className="text-sm text-gray-500 mb-4">무료 견적 받기</p>
              <div className="flex justify-end">
                <Truck className="w-16 h-16 text-green-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">오늘의 추천 고수예요</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-xl p-4 flex gap-4 items-center hover:bg-gray-50 cursor-pointer">
                <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  {/* Placeholder for avatar */}
                  <UserCheck className="w-full h-full p-3 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">청소마스터 김고수</h4>
                  <p className="text-xs text-gray-500">리뷰 158개 • 평점 4.9</p>
                  <div className="mt-2 flex gap-1">
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">친절해요</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">꼼꼼해요</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
