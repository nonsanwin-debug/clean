import { createClient } from "@/lib/supabase/server"
import { RequestTable } from "@/components/admin/request-table"
import { PartnerTable } from "@/components/admin/partner-table"

export const dynamic = 'force-dynamic' // Ensure we fetch fresh data

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const { data: requests, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: partners } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching requests:", error)
        return <div className="p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Requests Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">견적 요청 관리</h1>
                        <p className="text-muted-foreground mt-1">접수된 고객 견적 요청 목록입니다.</p>
                    </div>
                </div>
                <RequestTable requests={requests as any[]} />
            </section>

            {/* Partners Section */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">파트너 승인 관리</h2>
                        <p className="text-muted-foreground mt-1">가입 신청한 파트너 목록입니다.</p>
                    </div>
                </div>
                <PartnerTable partners={partners as any[]} />
            </section>
        </div>
    )
}
