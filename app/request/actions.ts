'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SubmitRequestState = {
    success?: boolean;
    error?: string;
    message?: string;
}

export async function submitRequest(data: any) {
    // In a real app we should validate 'data' with Zod here.

    // Construct the DB object
    // serviceType, sqFt, etc matches the keys from the form
    const dbData = {
        service_type: data.serviceType,
        sq_ft: data.sqFt,
        target_date: data.date ? new Date(data.date).toISOString().split('T')[0] : null,
        location: data.location,
        description: data.description, // Can still capture 'anything else?' here
        customer_name: data.name,
        customer_phone: data.phone,
        status: 'pending',
        // New detailed fields
        building_type: data.buildingType,
        room_count: data.roomCount,
        bathroom_count: data.bathroomCount,
        room_count: data.roomCount,
        bathroom_count: data.bathroomCount,
        veranda_count: data.verandaCount,
        features: data.features || [],
        extra_services: data.extraServices || [],
        date_type: data.dateType,
        max_quotes: data.maxQuotes // Added max_quotes
    }

    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('requests')
            .insert(dbData)

        if (error) {
            console.error('Supabase Insert Error:', error)
            return {
                success: false,
                message: '요청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
            }
        }

        revalidatePath('/request')
        return {
            success: true,
            message: '견적 요청이 성공적으로 접수되었습니다!'
        }

    } catch (e) {
        console.error('Server Action Error:', e)
        return {
            success: false,
            message: '서버 오류가 발생했습니다.'
        }
    }
}
