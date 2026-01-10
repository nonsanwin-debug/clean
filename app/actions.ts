'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function submitRequest(formData: any) {
  const supabase = await createClient()

  // Note: In a real app, we should validate the user is logged in or create an anonymous user/profile first.
  // For this MVP, we'll assume we might need to create a profile or just insert if we allow public requests (with RLS adjustment).
  // However, the schema forces `customer_id`. 

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()

  let customerId = user?.id

  // If no user, for MVP demo purposes we might need a workaround or require auth.
  // For now, let's assume the user must be logged in, or we handle anon auth on the client before calling this.
  // But to make the "Wizard" smooth, we usually create the account at the end.

  if (!customerId) {
    // Scenario: User fills form -> Enters phone/name -> We create auth user (or check existence)
    // This logic is complex for a simple action.
    // Simplified: Return error asking to login, or (better) Mock for now if no backend is live.
  }

  // Example insertion logic
  /*
  const { error } = await supabase
    .from('requests')
    .insert({
      customer_id: customerId,
      service_type: formData.serviceType,
      sq_ft: parseInt(formData.sqFt),
      location: formData.location,
      preferred_date: formData.date,
      description: formData.description,
      // name/phone usually go to profile or separate contact fields if not in profile
    })
    
  if (error) {
    throw new Error('Failed to submit request')
  }
  */

  // Mock Success for UI Demo
  console.log("Server Action received:", formData)

  // Redirect to success page or return success state
  return { success: true, message: "Request received" }
}
