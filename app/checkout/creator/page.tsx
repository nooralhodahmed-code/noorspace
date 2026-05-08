"use client";

import { useSearchParams, useRouter } from "next/navigation";

// --- ANIMATED LOGO (same as before) ---
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

// --- PRICE LOOKUP ---
const planPrices: Record<string, Record<string, number>> = {
    basic: { monthly: 2, yearly: 20 },
    pro: { monthly: 79, yearly: 790 },
};

const planNames: Record<string, string> = {
    basic: "الأساسية",
    pro: "الاحترافية",
};

export default function CreatorCheckoutPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "basic";
    const interval = searchParams.get("interval") || "monthly";
    const amount = planPrices[plan]?.[interval] || 0;
    const planName = planNames[plan] || plan;
    const intervalLabel = interval === "yearly" ? "سنوي" : "شهري";
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#F5F3EF] flex flex-col items-center justify-center p-6" dir="rtl">
            {/* Logo centered at the top */}
            <div className="mb-8">
                <AnimatedLogo className="text-3xl" />
            </div>

            {/* Checkout card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md space-y-6">
                <h2 className="text-2xl font-black text-[#1A1F2B] text-center">إتمام الدفع</h2>

                {/* Order summary */}
                <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">الخطة</span>
                        <span className="text-sm font-bold text-[#1A1F2B]">{planName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">المدة</span>
                        <span className="text-sm font-bold text-[#1A1F2B]">{intervalLabel}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-base font-black text-[#1A1F2B]">المجموع</span>
                        <span className="text-xl font-black text-[#1A1F2B]">
                            ${amount}
                        </span>
                    </div>
                </div>

                {/* Placeholder Pay button */}
                <button
                    onClick={() => alert("سيتم ربط Paymob قريباً")}
                    className="w-full py-4 bg-[#E6C65D] hover:bg-[#D4A93A] text-[#1A1F2B] font-black text-lg rounded-xl transition-all shadow-sm"
                >
                    ادفع الآن
                </button>

                <p className="text-xs text-center text-slate-400 font-medium">
                    سيتم توجيهك إلى بوابة الدفع الآمنة
                </p>
            </div>

            {/* Outlined back button below card */}
            <button
                onClick={() => router.back()}
                className="mt-6 px-6 py-2 border-2 border-slate-300 text-slate-600 font-bold text-sm rounded-xl hover:border-slate-400 hover:text-slate-800 transition-colors"
            >
                رجوع
            </button>
        </main>
    );
}