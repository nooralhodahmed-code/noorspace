"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import GoogleSignIn from "@/components/GoogleSignIn";

const AnimatedLogo = ({ className = "" }: { className?: string }) => {
  return (
    <span className={`group inline-flex items-center font-heading font-bold tracking-tight cursor-default ${className}`} dir="ltr">
      <style jsx>{`
        @keyframes eye-movement {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(0, -15%); }
          15% { transform: translate(0, 0); }
          40% { transform: translate(0, 0); }
          45% { transform: translate(-10%, 0); }
          55% { transform: translate(-10%, 0); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(15%, 0); }
          75% { transform: translate(0, 0); }
        }
        .animate-eyes { display: inline-block; animation: eye-movement 5s ease-in-out infinite; }
        .delay-slight { animation-delay: 0.05s; }
      `}</style>
      <span className="text-[#8CAB46] flex items-baseline">
        n<span className="animate-eyes mx-[0.05em]">o</span>
        <span className="animate-eyes delay-slight mx-[0.05em]">O</span>r
      </span>
      <span className="relative flex items-center overflow-hidden h-[1.2em] w-[2.7em] ml-[0.05em]">
        <span className="absolute inset-0 flex items-center text-[#E6C65D] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-[100%] group-hover:opacity-0">Space</span>
        <span className="absolute inset-0 flex items-center justify-start text-[#E6C65D] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[0.9em] h-[0.9em] ml-[0.1em]">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
          </svg>
        </span>
      </span>
    </span>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async () => {
    setErrors({ email: "", password: "" });
    setAuthError("");

    if (!email) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني مطلوب" }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "كلمة السر مطلوبة" }));
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setAuthError("البريد الإلكتروني أو كلمة السر غير صحيحة");
    } else if (authData.user) {
      // Fetch profile to check onboarding status
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', authData.user.id)
        .single();

      // Redirect based on whether they finished onboarding or not
      if (!profile?.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-slate-700" dir="rtl">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <div className="text-center">
           <AnimatedLogo className="text-5xl mb-2" />
           <h2 className="text-2xl font-bold">سجل دخولك إلى noOrSpace</h2>
        </div>

        <div className="w-full bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
          <div className="relative">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className={`w-full p-5 border-b focus:outline-none text-right text-lg transition-all ${errors.email ? 'bg-red-50 border-red-300' : 'border-slate-100'}`}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة السر"
              className={`w-full p-5 focus:outline-none text-right text-lg transition-all ${errors.password || authError ? 'bg-red-50' : ''}`}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.29 4.037 4.857 7 9.066 7 1.94 0 3.763-.63 5.258-1.703m1.384-1.384A10.446 10.446 0 0 0 22.066 12c-1.29-4.037-4.857-7-9.066-7-1.5 0-2.907.404-4.12 1.11m0 0L3.75 3.75M12 15a3 3 0 0 1-3-3m1.5-4.875L12 12m0 0 8.25 8.25" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              )}
            </button>
            {errors.password && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>
        </div>

        {authError && <p className="text-red-600 font-bold text-sm text-center bg-red-50 py-2 w-full rounded-xl border border-red-100">{authError}</p>}

        <button onClick={handleLogin} className="w-full bg-[#E6C65D] text-slate-800 py-4 rounded-2xl font-bold text-xl shadow-md hover:opacity-90 transition-all active:scale-[0.98]">دخول</button>

        <div className="w-full flex justify-between items-center text-sm font-bold">
          <a href="/forgot-password" className="text-blue-600 hover:underline">نسيت كلمة السر ؟</a>
          <div className="flex items-center gap-2 text-slate-500">
            <span>تذكرني</span>
            <input type="checkbox" className="w-4 h-4 rounded-full accent-slate-300" />
          </div>
        </div>

        <div className="w-full flex items-center gap-4 py-1">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-slate-400 font-bold text-xs">أو تابع عن طريق</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <GoogleSignIn className="w-full bg-slate-900 text-white border-none hover:bg-slate-800 justify-center" />

        <p className="font-bold text-sm">ليس لديك حساب؟ <a href="/signup" className="text-blue-600 hover:underline">أنشئ حسابك الآن</a></p>
      </div>
    </main>
  );
}