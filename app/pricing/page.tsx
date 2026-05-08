"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const router = useRouter();

    const handleCheckout = (plan: string) => {
        const interval = isAnnual ? "yearly" : "monthly";
        router.push(`/checkout/creator?plan=${plan}&interval=${interval}`);
    };

    return (
        <div className="min-h-screen bg-offwhite text-[#1A1F2B] font-sans flex flex-col pb-20" dir="rtl">

            {/* Top Navigation */}
            <div className="pt-8 flex justify-center shrink-0">
                <nav className="flex items-center gap-1 bg-white border border-slate-400 rounded-2xl p-1.5 shadow-sm">
                    <div className="px-4 flex items-center justify-center">
                        <Logo className="text-xl text-[#1A1F2B]" />
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#1A1F2B] hover:bg-slate-100 rounded-xl transition-colors">الرئيسية</Link>
                    <Link href="/pricing" className="px-4 py-2 text-sm font-bold text-[#1A1F2B] bg-slate-100 rounded-xl">الأسعار</Link>
                    <Link href="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#1A1F2B] hover:bg-slate-100 rounded-xl transition-colors">تواصل معنا</Link>
                    <div className="mr-2 pr-2">
                        <Link href="/login" className="px-6 py-2 text-sm font-bold bg-[#1A1F2B] text-white hover:bg-slate-800 rounded-xl transition-colors block">
                            تسجيل الدخول
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Pricing Header */}
            <div className="mt-16 text-center px-4 shrink-0">
                <h1 className="text-4xl font-black mb-8 text-[#1A1F2B]">تسعير سهل وشفاف</h1>

                <div className="relative inline-flex flex-col items-center">
                    <span className="absolute -top-3 -left-4 bg-[#E5C158] text-[#1A1F2B] text-[10px] font-black px-3 py-1 rounded-full z-10 shadow-md">
                        وفر شهرين
                    </span>
                    <div className="flex bg-white border border-pistachio rounded-xl p-1 shadow-sm relative gap-1">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-10 py-2.5 text-sm font-bold rounded-lg transition-all ${!isAnnual ? 'bg-pistachio text-white' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
                        >
                            شهري
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-10 py-2.5 text-sm font-bold rounded-lg transition-all ${isAnnual ? 'bg-pistachio text-white' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
                        >
                            سنوي
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">

                {/* Basic Plan Card */}
                <div className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 flex flex-col relative">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-black mb-2">الأساسية</h3>
                        <p className="text-sm font-bold text-slate-400 mb-6 text-center">ابدأ وابن مجتمعك بدون أي مخاطرة</p>
                        <div className="text-5xl font-black">
                            ${isAnnual ? '20' : '2'} <span className="text-xl font-bold text-slate-400">/ {isAnnual ? 'السنة' : 'الشهر'}</span>
                        </div>
                    </div>

                    <div className="space-y-5 mb-12 flex-1">
                        {[
                            "أعضاء غير محدودين",
                            "دورات ومحتوى غير محدود",
                            "10% رسوم المعاملات",
                            "خيارات اشتراكات مدفوعة متعددة",
                            "أدوات لإضافة المتعة والمكافآت",
                            "دعم 24/7"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i === 2 ? 'bg-slate-100 text-slate-400' : 'bg-pistachio text-white'}`}>
                                    <Check size={14} strokeWidth={4} />
                                </div>
                                <span className="text-base font-bold text-[#1A1F2B]">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-auto">
                        <img
                            src="/cat-free.png"
                            alt="Sitting Cat"
                            className="absolute -top-18 right-9 h-24 z-30 pointer-events-none object-contain translate-y-3"
                        />
                        <button
                            onClick={() => handleCheckout("basic")}
                            className="relative w-full py-5 bg-[#F6E3A3] text-[#1A1F2B] hover:bg-[#E5C158] font-black text-xl rounded-2xl transition-all z-20 shadow-sm"
                        >
                            ابدأ مجاناً
                        </button>
                    </div>
                </div>

                {/* Pro Plan Card */}
                <div className="bg-white rounded-[20px] p-10 shadow-xl border border-slate-100 flex flex-col relative overflow-visible">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-black mb-2">الاحترافية</h3>
                        <p className="text-sm font-bold text-slate-400 mb-6 text-center">عندما تنمو أرباحك، قم بالترقية لتوفير الرسوم</p>
                        <div className="text-5xl font-black">
                            ${isAnnual ? '790' : '79'} <span className="text-xl font-bold text-slate-400">/ {isAnnual ? 'السنة' : 'الشهر'}</span>
                        </div>
                    </div>

                    <div className="space-y-5 mb-12 flex-1">
                        {[
                            "أعضاء غير محدودين",
                            "دورات ومحتوى غير محدود",
                            "5% رسوم المعاملات",
                            "خيارات اشتراكات مدفوعة متعددة",
                            "أدوات لإضافة المتعة والمكافآت",
                            "دعم 24/7"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full bg-pistachio text-white flex items-center justify-center shrink-0">
                                    <Check size={14} strokeWidth={4} />
                                </div>
                                <span className="text-base font-bold text-[#1A1F2B]">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <img
                        src="/cat-pro.png"
                        alt="Hiding Cat"
                        className="absolute bottom-9 -left-13 h-25 z-30 pointer-events-none object-contain"
                    />

                    <div className="relative mt-auto">
                        <button
                            onClick={() => handleCheckout("pro")}
                            className="relative w-full py-5 bg-[#F6E3A3] text-[#1A1F2B] hover:bg-[#E5C158] font-black text-xl rounded-2xl transition-all z-20 shadow-sm"
                        >
                            إشترك الآن
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}