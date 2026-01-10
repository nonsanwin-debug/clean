import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default async function PartnerDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: partner, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !partner) {
        return (
            <div className="container mx-auto p-8 text-center text-red-500">
                파트너 정보를 찾을 수 없습니다.
                <br />
                <Link href="/admin">
                    <Button variant="outline" className="mt-4">돌아가기</Button>
                </Link>
            </div>
        )
    }

    const categoryLabels: Record<string, string> = {
        'home': '입주/집 청소',
        'appliance': '가전/가구 청소',
        'business': '사업장 청소',
        'special': '특수 청소',
        'disposal': '철거/폐기',
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/admin" className="text-muted-foreground hover:text-black mb-6 inline-block">
                ← 목록으로 돌아가기
            </Link>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{partner.name}</h1>
                    <p className="text-muted-foreground">가입일: {format(new Date(partner.created_at), 'yyyy-MM-dd HH:mm')}</p>
                </div>
                <Badge className={partner.status === 'approved' ? 'bg-green-500' : 'bg-gray-500'}>
                    {partner.status === 'approved' ? '승인됨' : partner.status === 'pending' ? '승인 대기' : partner.status}
                </Badge>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>기본 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">연락처</div>
                                <div className="text-lg">{partner.phone}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">이메일 (아이디)</div>
                                <div className="text-lg">{partner.email || '-'}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">활동 지역</div>
                                <div className="text-lg">{partner.area}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">로그인 방식</div>
                                <div className="text-lg capitalize">{partner.provider}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">경력 및 소개</div>
                            <div className="bg-slate-50 p-3 rounded-md">{partner.experience}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>제공 서비스</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">카테고리</h3>
                            <div className="flex flex-wrap gap-2">
                                {partner.categories && partner.categories.length > 0 ? (
                                    partner.categories.map((cat: string) => (
                                        <Badge key={cat} variant="secondary" className="px-3 py-1 text-sm">
                                            {categoryLabels[cat] || cat}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-400">선택된 카테고리 없음</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">상세 가능 작업</h3>
                            <div className="flex flex-wrap gap-2">
                                {partner.services && partner.services.length > 0 ? (
                                    partner.services.map((svc: string) => (
                                        <div key={svc} className="bg-white border rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm">
                                            {svc}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">선택된 상세 작업 없음</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
