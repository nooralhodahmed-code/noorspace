"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- ANIMATED LOGO ---
const AnimatedLogo = ({ className = "" }: { className?: string }) => (
  <span className={`group inline-flex items-center font-heading font-bold tracking-tight cursor-default ${className}`} dir="ltr">
    <style jsx>{`
      @keyframes eye-movement {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(0, -15%); }
        15% { transform: translate(0, 0); }
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

// --- DATA ---
const COUNTRIES = [
  { name: "Egypt", code: "+20", flag: "🇪🇬", iso: "EG", length: 10 },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", iso: "SA", length: 9 },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", iso: "AE", length: 9 },
  { name: "Kuwait", code: "+965", flag: "🇰🇼", iso: "KW", length: 8 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", iso: "QA", length: 8 },
  { name: "Bahrain", code: "+973", flag: "🇧🇭", iso: "BH", length: 8 },
  { name: "Oman", code: "+968", flag: "🇴🇲", iso: "OM", length: 8 },
  { name: "Morocco", code: "+212", flag: "🇲🇦", iso: "MA", length: 9 },
  { name: "Jordan", code: "+962", flag: "🇯🇴", iso: "JO", length: 9 },
  { name: "Lebanon", code: "+961", flag: "🇱🇧", iso: "LB", length: 8 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", iso: "GB", length: 10 },
  { name: "United States", code: "+1", flag: "🇺🇸", iso: "US", length: 10 },
  { name: "Canada", code: "+1", flag: "🇨🇦", iso: "CA", length: 10 },
  { name: "France", code: "+33", flag: "🇫🇷", iso: "FR", length: 9 },
  { name: "Germany", code: "+49", flag: "🇩🇪", iso: "DE", length: 11 },
  { name: "Turkey", code: "+90", flag: "🇹🇷", iso: "TR", length: 10 },
  { name: "India", code: "+91", flag: "🇮🇳", iso: "IN", length: 10 },
  { name: "China", code: "+86", flag: "🇨🇳", iso: "CN", length: 11 },
  { name: "Australia", code: "+61", flag: "🇦🇺", iso: "AU", length: 9 },
  { name: "Brazil", code: "+55", flag: "🇧🇷", iso: "BR", length: 11 },
  { name: "Algeria", code: "+213", flag: "🇩🇿", iso: "DZ", length: 9 },
  { name: "Tunisia", code: "+216", flag: "🇹🇳", iso: "TN", length: 8 },
  { name: "Libya", code: "+218", flag: "🇱🇾", iso: "LY", length: 9 },
  { name: "Sudan", code: "+249", flag: "🇸🇩", iso: "SD", length: 9 },
  { name: "Iraq", code: "+964", flag: "🇮🇶", iso: "IQ", length: 10 },
  { name: "Spain", code: "+34", flag: "🇪🇸", iso: "ES", length: 9 },
  { name: "Japan", code: "+81", flag: "🇯🇵", iso: "JP", length: 10 },
  { name: "Afghanistan", code: "+93", flag: "🇦🇫", iso: "AF", length: 9 },
  { name: "Argentina", code: "+54", flag: "🇦🇷", iso: "AR", length: 10 },
  { name: "Austria", code: "+43", flag: "🇦🇹", iso: "AT", length: 10 },
];

// --- MAIN PAGE ---
export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();
  const router = useRouter();

  const filteredCountries = useMemo(() =>
    COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery) ||
      c.iso.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && searchRef.current) searchRef.current.focus();
  }, [isDropdownOpen]);

  // Reset whatsapp input if country changes
  useEffect(() => {
    setWhatsapp("");
  }, [selectedCountry]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
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
    if (whatsapp.length !== selectedCountry.length) return alert(`Please enter exactly ${selectedCountry.length} digits for ${selectedCountry.name}.`);
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("No user found. Please log in again.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        whatsapp: `${selectedCountry.code}${whatsapp}`,
        onboarding_completed: true
      })
      .eq("id", user.id);
    if (error) {
      console.error("Onboarding update error:", error);
      alert("Something went wrong. Check the console (F12) for details.");
      setSaving(false);
      return;
    }
    router.push(role === "creator" ? "/pricing?role=creator" : "/dashboard");
  };

  const isValid = role && whatsapp.length === selectedCountry.length;

  if (loading) return null;

  return (
    <main className="min-h-screen flex bg-offwhite text-slate-text font-sans overflow-hidden" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { font-family: 'IBM Plex Sans Arabic', sans-serif; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .anim-slide-1 { animation: slideUp 0.5s ease both; animation-delay: 0.05s; }
        .anim-slide-2 { animation: slideUp 0.5s ease both; animation-delay: 0.15s; }
        .anim-slide-3 { animation: slideUp 0.5s ease both; animation-delay: 0.25s; }
        .anim-slide-4 { animation: slideUp 0.5s ease both; animation-delay: 0.35s; }
        .anim-slide-5 { animation: slideUp 0.5s ease both; animation-delay: 0.45s; }

        .dropdown-anim { animation: dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .btn-submit {
          background: linear-gradient(135deg, #E6C65D 0%, #D4A93A 100%);
          box-shadow: 0 4px 20px rgba(230, 198, 93, 0.35), 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 8px 30px rgba(230, 198, 93, 0.45), 0 2px 6px rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }

        .card-user { transition: all 0.2s ease; }
        .card-user:hover { transform: translateY(-2px); }

        .phone-input-wrap:focus-within .phone-border { border-color: #E6C65D !important; box-shadow: 0 0 0 3px rgba(230,198,93,0.15); }

        .country-row:hover { background: #F8F7F4; }
        .country-row.selected-row { background: #f0f7e6; }
      `}</style>

      {/* ─── SIDEBAR (Simplified) ─── */}
      <aside className="hidden lg:flex w-[380px] shrink-0 bg-blue-slate flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#8CAB46]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full bg-[#E6C65D]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-8">
          <AnimatedLogo className="text-4xl" />
          <p className="text-white/80 text-xl leading-relaxed italic">
            مساحتك تبدأ من هنا
          </p>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <section className="flex-1 flex flex-col justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-[520px] w-full mx-auto space-y-8">

          {/* Header */}
          <div className="anim-slide-1 space-y-2">
            <p className="text-sm font-semibold text-[#8CAB46] uppercase tracking-widest">خطوة 1 من 3</p>
            <h1 className="text-3xl font-bold text-[#111318] tracking-tight">إعداد حسابك</h1>
            <p className="text-[#111318]/60 text-base">سيستغرق هذا أقل من دقيقتين.</p>
          </div>

          {/* ── STEP 1: Account Type ── */}
          <div className="anim-slide-2 space-y-3">
            <label className="text-sm font-bold uppercase tracking-[0.1em] text-[#111318]/50">
              اختر نوع الحساب
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Member card */}
              <button
                onClick={() => setRole("user")}
                className={`card-user relative p-5 rounded-2xl border-2 text-right transition-all ${role === "user"
                  ? "border-[#8CAB46] bg-white shadow-lg shadow-[#8CAB46]/10"
                  : "border-[#111318]/10 bg-white hover:border-[#111318]/25 hover:shadow-md"
                  }`}
              >
                {role === "user" && (
                  <div className="absolute top-4 left-4 w-6 h-6 bg-[#8CAB46] rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className="w-12 h-12 bg-[#8CAB46]/10 rounded-xl flex items-center justify-center mb-4 text-2xl">🤝</div>
                <h3 className="font-bold text-[#111318] text-base leading-snug mb-1">أنا هنا للانضمام</h3>
                <p className="text-sm text-[#111318]/50 leading-relaxed">استكشف وتعلم من الخبراء</p>
              </button>

              {/* Creator card */}
              <button
                onClick={() => setRole("creator")}
                className={`card-user relative p-5 rounded-2xl border-2 text-right transition-all ${role === "creator"
                  ? "border-[#8CAB46] bg-white shadow-lg shadow-[#8CAB46]/10"
                  : "border-[#111318]/10 bg-white hover:border-[#111318]/25 hover:shadow-md"
                  }`}
              >
                {role === "creator" && (
                  <div className="absolute top-4 left-4 w-6 h-6 bg-[#8CAB46] rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className="w-12 h-12 bg-[#E6C65D]/15 rounded-xl flex items-center justify-center mb-4 text-2xl">🚀</div>
                <h3 className="font-bold text-[#111318] text-base leading-snug mb-1">أنا هنا للبناء</h3>
                <p className="text-sm text-[#111318]/50 leading-relaxed">أنشئ مجتمعك وقدّم خدماتك</p>
              </button>
            </div>
          </div>

          {/* ── STEP 2: Phone Input (country flipped to left) ── */}
          <div className="anim-slide-3 space-y-3 relative z-50">
            <label className="text-sm font-bold uppercase tracking-[0.1em] text-[#111318]/50">
              رقم واتساب للتحقق
            </label>

            <div className="phone-input-wrap relative" ref={dropdownRef}>
              <div className={`phone-border flex items-center bg-white rounded-2xl border-2 transition-all duration-200 overflow-visible ${isDropdownOpen ? 'border-[#E6C65D] shadow-[0_0_0_3px_rgba(230,198,93,0.15)]' : 'border-[#111318]/15'}`}>

                {/* WhatsApp icon (leftmost in source = rightmost in RTL) */}
                <div className="px-4">
                  <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>

                {/* Phone number input */}
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="100 000 0000"
                  maxLength={selectedCountry.length}
                  className="flex-1 h-full px-5 py-4 bg-transparent outline-none text-lg font-bold tracking-wider text-[#111318] placeholder:text-[#111318]/25 min-w-0"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                />

                {/* Country Button – now on the left side (last in source = rightmost in RTL) */}
                <button
                  type="button"
                  onClick={() => { setIsDropdownOpen(v => !v); }}
                  className="flex items-center gap-3 px-5 py-3 border-r-2 border-[#111318]/10 hover:bg-[#F8F7F4] transition-colors rounded-l-2xl shrink-0 group"
                >
                  <svg
                    className={`w-4 h-4 text-[#111318]/30 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  ><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  <span className="text-base font-bold text-[#111318] leading-none">{selectedCountry.code}</span>
                  <span className="text-2xl leading-none">{selectedCountry.flag}</span>
                </button>
              </div>

              {/* ── Country Dropdown ── */}
              {isDropdownOpen && (
                <div className="dropdown-anim absolute top-[calc(100%+8px)] right-0 left-0 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#111318]/10 overflow-hidden">
                  <div className="p-4 border-b border-[#111318]/10">
                    <div className="flex items-center gap-3 bg-[#F8F7F4] rounded-xl px-4 py-3">
                      <svg className="w-5 h-5 text-[#111318]/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="ابحث عن الدولة..."
                        className="flex-1 bg-transparent outline-none text-base font-medium text-[#111318] placeholder:text-[#111318]/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-[#111318]/40 hover:text-[#111318]/70 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="py-8 text-center text-base text-[#111318]/40">لا توجد نتائج</div>
                    ) : filteredCountries.map(c => (
                      <button
                        key={`${c.iso}-${c.code}`}
                        className={`country-row w-full px-5 py-3.5 flex items-center justify-between transition-colors border-b border-[#111318]/5 last:border-0 ${selectedCountry.iso === c.iso ? 'selected-row' : ''}`}
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl leading-none">{c.flag}</span>
                          <span className="text-base font-semibold text-[#111318]">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#111318]/50 font-mono">{c.code}</span>
                          {selectedCountry.iso === c.iso && (
                            <div className="w-5 h-5 bg-[#8CAB46] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-[#111318]/50 font-medium flex items-center gap-2 pr-1">
              <svg className="w-4 h-4 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              سيصلك كود التحقق عبر واتساب
            </p>
          </div>

          {/* ── Submit Button ── */}
          <div className="anim-slide-4 space-y-4">
            <button
              disabled={saving || !isValid}
              onClick={handleFinish}
              className="btn-submit relative w-full h-[54px] text-[#111318] rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {saving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  ابدأ رحلتك الآن
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#111318]/40 font-medium">
              بمتابعتك، أنت توافق على{" "}
              <a href="#" className="underline hover:text-[#111318]/70 transition-colors">شروط الاستخدام</a>
              {" "}و{" "}
              <a href="#" className="underline hover:text-[#111318]/70 transition-colors">سياسة الخصوصية</a>
            </p>
          </div>

          <div className="anim-slide-5 pt-2 border-t border-[#111318]/10">
            <p className="text-center text-xs font-semibold text-[#111318]/30 uppercase tracking-widest">
              noOrSpace • Cairo, Egypt • 2026
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}