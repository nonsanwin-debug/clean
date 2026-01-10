import React from 'react'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/partner/dashboard-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PartnerDashboardPage() {
    const supabase = await createClient()

    // In a real app, verify partner session here
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) redirect('/partner/login')

    // Fetch all requests for demo purposes
    // In reality, we would filter by partner's service categories and area
    const { data: requests, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching requests:", error)
        return <div>데이터를 불러오는데 실패했습니다.</div>
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="border-b h-16 flex items-center px-6 bg-white shrink-0 justify-between">
                <div className="font-bold text-xl text-primary"></div>
                <div className="text-sm text-muted-foreground">환영합니다, 파트너님</div>
            </header>
            <main className="flex-1 overflow-hidden">
                <DashboardClient requests={requests as any[]} />
            </main>
        </div>
    )
}
