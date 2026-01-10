import { createClient } from "@/lib/supabase/server"
import { RequestTable } from "@/components/admin/request-table"

export const dynamic = 'force-dynamic' // Ensure we fetch fresh data

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const { data: requests, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching requests:", error)
        return <div className="p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
                    <p className="text-muted-foreground mt-1">접수된 견적 요청 목록입니다.</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    총 {requests?.length || 0}건
                </div>
            </div>

            <RequestTable requests={requests as any[]} />
        </div>
    )
}
