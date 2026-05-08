"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Using your established AnimatedLogo
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleReset = async () => {
    setMessage("");
    setError("");
    
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى");
    } else {
      setMessage("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني");
    }
  };

  return (
    <main className="min-h-screen bg-offwhite flex flex-col items-center justify-center p-6 text-slate-text" dir="rtl">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        <div className="text-center">
           <AnimatedLogo className="text-5xl mb-4" />
           <h2 className="text-2xl font-bold">إعادة تعيين كلمة السر</h2>
           <p className="text-slate-500 mt-2 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً للعودة إلى حسابك.</p>
        </div>

        <div className="w-full bg-white card-section overflow-hidden">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full p-5 input-surface focus:outline-none text-right text-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}
        {message && <p className="text-[#8CAB46] font-bold text-sm text-center">{message}</p>}

        <button 
          onClick={handleReset}
          className="btn-primary w-full py-4 font-bold text-xl"
        >
          إرسال الرابط
        </button>

        <a href="/login" className="text-blue-slate font-bold hover:underline text-sm">العودة لتسجيل الدخول</a>
      </div>
    </main>
  );
}