'use client'
import { createClient } from '@/utils/supabase/client'

interface GoogleSignInProps {
  className?: string;
}

export default function GoogleSignIn({ className = "" }: GoogleSignInProps) {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        // HARDCODED FOR CODESPACES
        redirectTo: 'https://super-duper-capybara-jr4jp6w7r5wfj7v-3000.app.github.dev/auth/callback' 
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      className={`flex items-center gap-3 px-8 py-3 border border-slate-200 rounded-xl transition-all shadow-sm font-bold text-lg ${className || 'btn-secondary bg-white text-slate-text hover:bg-slate-50'}`}
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
      Google
    </button>
  )
}