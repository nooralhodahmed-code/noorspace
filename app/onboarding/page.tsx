"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- COMPONENTS ---

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
        <span className="absolute inset-0 flex items-center text-[#E6C65D] transition-all duration-500 ease-in-out group-hover:translate-y-full group-hover:opacity-0">Space</span>
        <span className="absolute inset-0 flex items-center justify-start text-[#E6C65D] transition-all duration-500 ease-in-out -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[0.9em] h-[0.9em] ml-[0.1em]">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
          </svg>
        </span>
      </span>
    </span>
  );
};

// --- DATA ---

const COUNTRIES = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫", length: 9 },
  { name: "Albania", code: "+355", flag: "🇦🇱", length: 9 },
  { name: "Algeria", code: "+213", flag: "🇩🇿", length: 9 },
  { name: "Andorra", code: "+376", flag: "🇦🇩", length: 6 },
  { name: "Angola", code: "+244", flag: "🇦🇴", length: 9 },
  { name: "Argentina", code: "+54", flag: "🇦🇷", length: 10 },
  { name: "Australia", code: "+61", flag: "🇦🇺", length: 9 },
  { name: "Austria", code: "+43", flag: "🇦🇹", length: 10 },
  { name: "Bahrain", code: "+973", flag: "🇧🇭", length: 8 },
  { name: "Brazil", code: "+55", flag: "🇧🇷", length: 11 },
  { name: "Canada", code: "+1", flag: "🇨🇦", length: 10 },
  { name: "China", code: "+86", flag: "🇨🇳", length: 11 },
  { name: "Egypt", code: "+20", flag: "🇪🇬", length: 10 },
  { name: "France", code: "+33", flag: "🇫🇷", length: 9 },
  { name: "Germany", code: "+49", flag: "🇩🇪", length: 11 },
  { name: "India", code: "+91", flag: "🇮🇳", length: 10 },
  { name: "Japan", code: "+81", flag: "🇯🇵", length: 10 },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", length: 8 },
  { name: "Morocco", code: "+212", flag: "🇲🇦", length: 9 },
  { name: "Oman", code: "+968", flag: "🇴🇲", length: 8 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", length: 8 },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", length: 9 },
  { name: "Spain", code: "+34", flag: "🇪🇸", length: 9 },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", length: 9 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", length: 10 },
  { name: "United States", code: "+1", flag: "🇺🇸", length: 10 },
];

// --- MAIN PAGE ---

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === "Egypt") || COUNTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.includes(searchQuery)
    );
  }, [searchQuery]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed, role")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        router.push(profile.role === "creator" ? "/dashboard/creator" : "/dashboard");
        return;
      }
      setLoading(false);
    };
    checkUser();
  }, [supabase, router]);

  const handleFinish = async () => {
    if (!role) return alert("Please select your role.");
    if (whatsapp.length < 7) return alert("Please enter a valid phone number.");

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        whatsapp: `${selectedCountry.code}${whatsapp}`,
        onboarding_completed: true,
      })
      .eq("id", user?.id);

    if (error) {
      alert("Something went wrong.");
      setSaving(false);
    } else {
      router.push(role === "creator" ? "/dashboard/creator" : "/dashboard");
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex bg-white font-sans overflow-hidden" dir="rtl">
      
      {/* --- SIDEBAR (StartGlobal Style) --- */}
      <section className="hidden lg:flex w-100 bg-slate-900 p-12 flex-col justify-between text-white relative">
        <div className="space-y-8 relative z-10">
          <AnimatedLogo className="text-4xl" />
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">على بعد خطوة واحدة من مساحتك الخاصة.</h2>
            <p className="text-slate-400 text-lg">ابدأ في دقيقتين. وفر وقتك، وطور مجتمعك.</p>
          </div>

          {/* Progress Steps */}
          <nav className="space-y-6 pt-12">
            {[
              { id: 1, name: "نوع الحساب", status: role ? "complete" : "current" },
              { id: 2, name: "التحقق من الهاتف", status: whatsapp.length >= selectedCountry.length ? "complete" : "upcoming" },
              { id: 3, name: "تفاصيل الحساب", status: "upcoming" }
            ].map((step) => (
              <div key={step.id} className="flex items-center gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.status === 'complete' ? 'bg-[#8CAB46] border-[#8CAB46]' : 
                  step.status === 'current' ? 'border-[#E6C65D]' : 'border-slate-700 text-slate-500'
                }`}>
                  {step.status === 'complete' ? '✓' : step.id}
                </div>
                <span className={`font-bold ${step.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>{step.name}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Abstract Illustration Background */}
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-linear-to-t from-[#8CAB46]/20 to-transparent opacity-50 blur-3xl pointer-events-none" />
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="flex-1 flex flex-col p-8 lg:p-24 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto space-y-12">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">إعداد الملف الشخصي</h1>
            <p className="text-slate-500 font-medium italic">أكمل البيانات التالية لتخصيص تجربتك.</p>
          </div>

          {/* STEP 1: ACCOUNT TYPE */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">1. اختر نوع الحساب</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setRole("user")}
                className={`p-6 rounded-2xl border-2 text-right transition-all group ${
                  role === "user" ? "border-[#8CAB46] bg-[#8CAB46]/5" : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className="text-3xl">🤝</span>
                   {role === "user" && <div className="w-5 h-5 bg-[#8CAB46] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>}
                </div>
                <h3 className="font-bold text-lg text-slate-900">أنا هنا للانضمام</h3>
                <p className="text-xs text-slate-500 leading-relaxed">أريد استكشاف المجتمعات والتعلم من الخبراء.</p>
              </button>

              <button 
                onClick={() => setRole("creator")}
                className={`p-6 rounded-2xl border-2 text-right transition-all group ${
                  role === "creator" ? "border-[#E6C65D] bg-[#E6C65D]/5" : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <span className="text-3xl">🚀</span>
                   {role === "creator" && <div className="w-5 h-5 bg-[#E6C65D] rounded-full flex items-center justify-center text-[10px] text-white">✓</div>}
                </div>
                <h3 className="font-bold text-lg text-slate-900">أنا هنا للبناء</h3>
                <p className="text-xs text-slate-500 leading-relaxed">أريد إنشاء مجتمعي الخاص وتقديم الاستشارات.</p>
              </button>
            </div>
          </div>

          {/* STEP 2: PREMIUM PHONE INPUT (Dribbble Style) */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">2. التحقق من رقم الواتساب</label>
            
            <div className="relative flex items-center">
              {/* Custom Searchable Country Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-16 px-5 border-2 border-l-0 border-slate-100 bg-slate-50 rounded-r-2xl flex items-center gap-3 hover:bg-slate-100 transition-all font-bold min-w-27.5"
                >
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <span className="text-slate-400 text-xs">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-20 right-0 w-70 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b border-slate-50">
                      <div className="relative flex items-center">
                        <span className="absolute right-3 text-slate-300">🔍</span>
                        <input 
                          autoFocus
                          placeholder="ابحث عن الدولة..."
                          className="w-full pr-10 pl-4 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-75 overflow-y-auto">
                      {filteredCountries.map(c => (
                        <button 
                          key={c.name}
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{c.flag}</span>
                            <span className="font-bold text-sm text-slate-700">{c.name}</span>
                          </div>
                          <span className="text-slate-400 font-mono text-xs">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <input 
                type="tel"
                dir="ltr"
                placeholder="(000) 000-0000"
                className="flex-1 h-16 px-6 border-2 border-slate-100 rounded-l-2xl outline-none focus:border-[#E6C65D] transition-all text-xl font-bold tracking-widest placeholder:text-slate-200"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
              />
              
              <div className="absolute left-6 text-[#E6C65D] font-black pointer-events-none">
                {selectedCountry.code}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-bold pr-2">سيصلك كود التحقق عبر واتساب فور الضغط على زر المتابعة.</p>
          </div>

          {/* SUBMIT */}
          <button 
            disabled={saving || !role || whatsapp.length < 5}
            onClick={handleFinish}
            className="w-full h-16 bg-[#E6C65D] text-slate-900 rounded-2xl font-black text-xl shadow-xl shadow-[#E6C65D]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {saving ? "جاري الحفظ..." : "ابدأ رحلتك الآن"}
            <span>→</span>
          </button>

          <footer className="pt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
            noOrSpace platform • Cairo, Egypt • All rights reserved 2026
          </footer>

        </div>
      </section>
    </main>
  );
}