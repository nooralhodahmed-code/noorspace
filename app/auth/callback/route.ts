import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // HARDCODED FOR CODESPACES
  const baseUrl = 'https://super-duper-capybara-jr4jp6w7r5wfj7v-3000.app.github.dev'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError && authData?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role')
        .eq('id', authData.user.id)
        .single()

      // Redirect based on status and role
      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(`${baseUrl}/onboarding`)
      }

      if (profile.role === 'creator') {
        return NextResponse.redirect(`${baseUrl}/dashboard/creator`)
      }

      return NextResponse.redirect(`${baseUrl}/dashboard`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
}