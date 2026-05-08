"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Added this
import { useRouter } from "next/navigation"; // Added this
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

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", whatsapp: "", password: "" });
  const [authError, setAuthError] = useState(""); // Added for Supabase errors
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const supabase = createClient();
  const router = useRouter();

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validatePhone = (phone: string) => {
    return phone.match(/^\+?[0-9]{10,15}$/);
  };

  const handleSignup = async () => {
    const newErrors = { name: "", email: "", whatsapp: "", password: "" };
    setAuthError("");

    if (!formData.name) newErrors.name = "يرجى إدخال الإسم بالكامل";

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.whatsapp) {
      newErrors.whatsapp = "رقم الواتساب مطلوب";
    } else if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = "يرجى إدخال رقم هاتف صحيح (أرقام فقط)";
    }

    if (!formData.password) {
      newErrors.password = "كلمة السر مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة السر يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some(msg => msg !== "")) return;

    setLoading(true);

    // Get the intent (role) from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const selectedRole = searchParams.get('role') || 'user';

    // Call Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          whatsapp: formData.whatsapp,
          role: selectedRole,
          onboarding_completed: false
        }
      }
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    } else {
      // The redirect you wanted!
      router.push("/onboarding");
    }
  };

  return (
    <main className="min-h-screen bg-offwhite flex flex-col items-center justify-center p-6 text-slate-text" dir="rtl">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">

        <div className="text-center">
          <AnimatedLogo className="text-5xl mb-2" />
          <h2 className="text-2xl font-bold">أنشئ حسابك في noOrSpace</h2>
        </div>

        <div className="w-full bg-white card-section overflow-hidden">
          {/* NAME FIELD */}
          <div className="relative">
            <input
              type="text"
              placeholder="الإسم بالكامل"
              className={`w-full p-5 border-b focus:outline-none text-right text-lg transition-all ${errors.name ? 'bg-red-50 border-red-300' : 'border-slate-100'}`}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* EMAIL FIELD */}
          <div className="relative">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className={`w-full p-5 border-b focus:outline-none text-right text-lg transition-all ${errors.email ? 'bg-red-50 border-red-300' : 'border-slate-100'}`}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* WHATSAPP FIELD */}
          <div className="relative">
            <input
              type="tel"
              placeholder="رقم الواتساب"
              className={`w-full p-5 border-b focus:outline-none text-right text-lg transition-all ${errors.whatsapp ? 'bg-red-50 border-red-300' : 'border-slate-100'}`}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
            {errors.whatsapp && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.whatsapp}</p>}
          </div>

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة السر"
              className={`w-full p-5 focus:outline-none text-right text-lg transition-all ${errors.password ? 'bg-red-50' : ''}`}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.29 4.037 4.857 7 9.066 7 1.94 0 3.763-.63 5.258-1.703m1.384-1.384A10.446 10.446 0 0 0 22.066 12c-1.29-4.037-4.857-7-9.066-7-1.5 0-2.907.404-4.12 1.11m0 0L3.75 3.75M12 15a3 3 0 0 1-3-3m1.5-4.875L12 12m0 0 8.25 8.25" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
            {errors.password && <p className="absolute right-5 bottom-1 text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>
        </div>

        {authError && <p className="text-red-600 font-bold text-sm text-center bg-red-50 py-2 w-full rounded-xl border border-red-100">{authError}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="btn-primary w-full py-4 font-bold text-xl disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء"}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed px-4 font-bold">
          بالتسجيل، فإنك توافق على <span className="text-blue-slate cursor-pointer">شروطنا</span> و <span className="text-blue-slate cursor-pointer">سياسة الخصوصية</span> الخاصة بنا.
        </p>

        <div className="w-full flex items-center gap-4 py-1">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-slate-400 font-bold text-xs">أو تابع عن طريق</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <GoogleSignIn className="w-full bg-slate-900 text-white border-none hover:bg-slate-800 justify-center" />

        <p className="font-bold text-sm">
          هل لديك حساب بالفعل؟ <a href="/login" className="text-blue-600 hover:underline">تسجيل الدخول</a>
        </p>
      </div>
    </main>
  );
}