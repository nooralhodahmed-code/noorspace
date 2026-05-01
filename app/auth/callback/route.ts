import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError && authData?.user) {
      // 1. Check the new columns in your database
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role')
        .eq('id', authData.user.id)
        .single()

      // 2. If onboarding isn't done, send them to /onboarding
      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // 3. If they are a creator, send to creator dashboard
      if (profile.role === 'creator') {
        return NextResponse.redirect(`${origin}/dashboard/creator`)
      }

      // 4. Otherwise, send to standard dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}