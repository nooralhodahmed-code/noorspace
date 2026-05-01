'use client'
import { createClient } from '@/utils/supabase/client'

// We define that this component can take an optional 'className' string
interface GoogleSignInProps {
  className?: string;
}

export default function GoogleSignIn({ className = "" }: GoogleSignInProps) {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback` 
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      // If no className is passed, it defaults to the white/slate look
      className={`flex items-center gap-3 px-8 py-3 border border-slate-200 rounded-xl transition-all shadow-sm font-bold text-lg ${className || 'bg-white text-slate-800 hover:bg-slate-50'}`}
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
      Google
    </button>
  )
}