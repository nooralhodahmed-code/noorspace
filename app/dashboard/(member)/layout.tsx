import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

// --- ANIMATED LOGO COMPONENT ---
const SidebarLogo = () => (
  <span className="group inline-flex items-center font-heading font-bold tracking-tight cursor-default text-2xl" dir="ltr">
    <style>{`
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Secure the entire dashboard route
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch basic profile data for the UI
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single();

  // Redirect to onboarding if they bypassed it
  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const isCreator = profile.role === "creator";

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex font-sans text-[#111318]" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { font-family: 'IBM Plex Sans Arabic', sans-serif; }
      `}</style>

      {/* --- SIDEBAR (Right side in RTL) --- */}
      <aside className="w-[280px] bg-white border-l border-[#111318]/5 hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#111318]/5 flex items-center justify-center">
          <SidebarLogo />
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {/* Main Navigation */}
          <p className="px-3 text-[11px] font-bold text-[#111318]/40 uppercase tracking-widest mb-2 mt-4">المجتمع</p>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#8CAB46]/10 text-[#8CAB46] font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            المجالس (Feed)
          </Link>

          <Link href="/dashboard/classroom" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#111318]/5 text-[#111318]/70 font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            الفصول الدراسية
          </Link>

          {/* Creator Only Navigation */}
          {isCreator && (
            <>
              <p className="px-3 text-[11px] font-bold text-[#111318]/40 uppercase tracking-widest mb-2 mt-8">أدوات المنشئ</p>
              
              <Link href="/dashboard/creator" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#111318]/5 text-[#111318]/70 font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                لوحة التحكم
              </Link>
              
              <Link href="/dashboard/creator/members" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#111318]/5 text-[#111318]/70 font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                الأعضاء
              </Link>
            </>
          )}
        </nav>

        {/* User Profile Mini-bar at bottom of sidebar */}
        <div className="p-4 border-t border-[#111318]/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#111318]/5 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8CAB46] to-[#E6C65D] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-[#111318]/40 truncate">{isCreator ? 'منشئ محتوى' : 'عضو'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-[76px] bg-white/80 backdrop-blur-md border-b border-[#111318]/5 sticky top-0 z-40 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold">المجالس</h2>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-[#111318]/5 flex items-center justify-center text-[#111318]/40 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-[#111318]/5 flex items-center justify-center text-[#111318]/40 transition-colors relative">
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E6C65D] rounded-full border-2 border-white"></div>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Injector */}
        <div className="p-8 max-w-[1000px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}