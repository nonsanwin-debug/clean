import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MessageCircle, MoveRight } from "lucide-react";

// Mock Data for Demo
const MOCK_REQUESTS = [
    { id: 1, type: "move_in", typeLabel: "입주/이사 청소", location: "서울시 강남구 역삼동", sqFt: 34, date: "2026-02-15", name: "김철수", status: "open" },
    { id: 2, type: "residence", typeLabel: "거주 청소", location: "경기도 성남시 분당구", sqFt: 28, date: "2026-02-20", name: "이영희", status: "open" },
    { id: 3, type: "commercial", typeLabel: "상가/사무실", location: "서울시 송파구 잠실동", sqFt: 50, date: "2026-03-01", name: "박민수", status: "quoted" },
];

export default function PartnerDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">파트너 대시보드</h1>
                    <p className="text-muted-foreground mt-1">
                        내 주변의 새로운 신규 요청을 확인하세요.
                    </p>
                </div>
                <Button>
                    알림 설정
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_REQUESTS.map((req) => (
                    <Card key={req.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant={req.type === 'move_in' ? 'default' : 'secondary'} className="mb-2">
                                    {req.typeLabel}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">#{req.id}</span>
                            </div>
                            <CardTitle className="flex items-baseline gap-2">
                                {req.sqFt}평
                                <span className="text-sm font-normal text-muted-foreground">형</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{req.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{req.date}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button className="flex-1" variant="outline">
                                상세 보기
                            </Button>
                            <Button className="flex-1 gap-2">
                                견적 보내기 <MoveRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
