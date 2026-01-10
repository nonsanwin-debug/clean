'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitPartnerApplication(data: any) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('partners')
            .insert({
                name: data.name,
                phone: data.phone,
                area: data.area,
                experience: data.experience,
                categories: data.categories || [],
                services: data.services || [],
                email: data.email,
                password: data.password || null, // Optional for social login
                provider: data.loginMethod || 'email',
                status: 'pending'
            })

        if (error) {
            console.error('Partner Insert Error:', error)
            return { success: false, message: '신청 중 오류가 발생했습니다.' }
        }

        revalidatePath('/admin') // Update admin dashboard
        return { success: true, message: '파트너 신청이 완료되었습니다.' }
    } catch (e) {
        return { success: false, message: '서버 오류가 발생했습니다.' }
    }
}

export async function approvePartner(partnerId: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('partners')
            .update({ status: 'approved' })
            .eq('id', partnerId)

        if (error) throw error

        revalidatePath('/admin')
        return { success: true, message: '파트너가 승인되었습니다.' }
    } catch (e) {
        console.error(e)
        return { success: false, message: '승인 처리 중 오류가 발생했습니다.' }
    }
}

export async function sendQuote(data: { requestId: string, price: number, message: string }) {
    const supabase = await createClient()

    // In a real app, we would get the partnerId from the authenticated user session.
    // For this demo, we'll assume the quotes can be sent without strict partner_id linkage 
    // or we'll omit it for now if the table allows (nullable).

    try {
        const { error } = await supabase
            .from('quotes')
            .insert({
                request_id: data.requestId,
                price: data.price,
                message: data.message,
                status: 'sent'
            })

        if (error) {
            console.error('Send Quote Error:', error)
            return { success: false, message: '견적 발송 실패' }
        }

        revalidatePath('/partner/dashboard')
        return { success: true, message: '견적을 성공적으로 보냈습니다.' }
    } catch (e) {
        console.error(e)
        return { success: false, message: '서버 오류가 발생했습니다.' }
    }
}

export async function loginPartner(email: string) {
    const supabase = await createClient()

    try {
        const { data: partner, error } = await supabase
            .from('partners')
            .select('status, name')
            .eq('email', email)
            .single()

        if (error || !partner) {
            return { success: false, message: '등록되지 않은 이메일입니다.' }
        }

        if (partner.status === 'pending') {
            return { success: false, message: `안녕하세요 ${partner.name}님,\n아직 관리자 승인 대기 중입니다.\n승인이 완료되면 문자 메시지로 알려드립니다.` }
        }

        if (partner.status === 'approved') {
            return { success: true, message: `환영합니다, ${partner.name}님!` }
        }

        return { success: false, message: '로그인할 수 없는 상태입니다.' }
    } catch (e) {
        console.error(e)
        return { success: false, message: '서버 오류가 발생했습니다.' }
    }
}
