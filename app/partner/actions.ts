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
