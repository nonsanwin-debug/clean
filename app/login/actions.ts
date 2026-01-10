'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' }
    }

    redirect('/request')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
    }

    return { success: true, message: '가입 확인 이메일을 보냈습니다! 이메일을 확인해주세요.' }
}
