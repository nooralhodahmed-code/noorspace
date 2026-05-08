"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient } from '@supabase/supabase-js';

// This connects your code to your Supabase project
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        whatsapp: "",
        subject: ""
    });

    // This runs when they click the Search button
    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            setHasSearched(true);
        }
    };

    // This ensures they can ONLY type numbers in the WhatsApp field
    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNums = e.target.value.replace(/\D/g, "");
        setFormData({ ...formData, whatsapp: onlyNums });
    };

    // This is the "Brain" that sends the data to your SQL table
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // This sends the data to the table you just created
        const { error } = await supabase
            .from('support_requests')
            .insert([
                {
                    name: formData.name,
                    whatsapp: formData.whatsapp,
                    subject: formData.subject
                },
            ]);

        if (!error) {
            setIsSubmitted(true);
            // Wait 3 seconds, then clear everything
            setTimeout(() => {
                setIsSubmitted(false);
                setShowContactForm(false);
                setFormData({ name: "", whatsapp: "", subject: "" });
                setHasSearched(false);
                setSearchQuery("");
            }, 3000);
        } else {
            alert("حدث خطأ ما، يرجى المحاولة مرة أخرى.");
        }
    };

    return (
        <div className="min-h-screen bg-offwhite text-[#1A1F2B] font-sans flex flex-col" dir="rtl">

            {/* Top Navigation */}
            <div className="pt-8 flex justify-center shrink-0">
                <nav className="flex items-center gap-1 bg-white border border-slate-400 rounded-2xl p-1.5 shadow-sm">
                    <div className="px-4 flex items-center justify-center">
                        <Logo className="text-xl text-[#1A1F2B]" />
                    </div>
                    <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#1A1F2B] hover:bg-slate-100 rounded-xl transition-colors">الرئيسية</Link>
                    <Link href="/pricing" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#1A1F2B] hover:bg-slate-100 rounded-xl transition-colors">الأسعار</Link>
                    <Link href="/support" className="px-4 py-2 text-sm font-bold text-[#1A1F2B] bg-slate-100 rounded-xl">مركز المساعدة</Link>
                    <div className="mr-2 pr-2">
                        <Link href="/login" className="px-6 py-2 text-sm font-bold bg-[#1A1F2B] text-white hover:bg-slate-800 rounded-xl transition-colors block">
                            تسجيل الدخول
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Center Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6">
                <h1 className="text-5xl font-black mb-12 text-[#1A1F2B]">كيف يمكننا مساعدتك</h1>

                <div className="w-full max-w-2xl">
                    <div className="flex gap-3 mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث في قاعدة المعرفة"
                            className="flex-1 py-5 px-8 bg-white border border-slate-200 rounded-[20px] shadow-sm text-lg font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-pistachio transition-all"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-10 py-5 bg-[#F6E3A3] hover:bg-[#E5C158] text-[#1A1F2B] font-black text-xl rounded-[20px] transition-all shadow-sm"
                        >
                            بحث
                        </button>
                    </div>

                    {hasSearched && (
                        <div className="text-center animate-in fade-in slide-in-from-top-4">
                            <p className="text-slate-500 font-bold mb-6">لا توجد نتائج مطابقة لبحثك حالياً.</p>
                            <button
                                onClick={() => setShowContactForm(true)}
                                className="text-blue-600 font-black text-lg hover:text-blue-800 hover:underline underline-offset-8 transition-colors"
                            >
                                لم تجد إجابتك؟ تواصل معنا
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1A1F2B]/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl relative">
                        {!isSubmitted ? (
                            <>
                                <button onClick={() => setShowContactForm(false)} className="absolute top-6 left-6 text-slate-400 hover:text-[#1A1F2B]">
                                    <X size={24} />
                                </button>
                                <h2 className="text-2xl font-black mb-8 text-center text-[#1A1F2B]">تواصل معنا</h2>
                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black mb-2 mr-1">الاسم</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-pistachio transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black mb-2 mr-1">رقم الواتساب</label>
                                        <input
                                            required
                                            type="text"
                                            inputMode="numeric"
                                            className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-pistachio text-left transition-all"
                                            dir="ltr"
                                            placeholder="أدخل رقم واتساب صحيح لنصل إليك"
                                            value={formData.whatsapp}
                                            onChange={handleWhatsAppChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black mb-2 mr-1">الموضوع</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-pistachio resize-none transition-all"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-[#F6E3A3] hover:bg-[#E5C158] text-[#1A1F2B] font-black text-lg rounded-2xl transition-all mt-4 shadow-sm">
                                        إرسال الطلب
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <CheckCircle2 size={64} className="text-pistachio mb-4" />
                                <h2 className="text-2xl font-black text-[#1A1F2B]">تم الإرسال بنجاح</h2>
                                <p className="text-slate-500 font-bold mt-2">سنقوم بالتواصل معك عبر الواتساب قريباً.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="py-8 text-center text-sm font-bold text-slate-500">
                © 2026 noOrSpace. جميع الحقوق محفوظة
            </footer>
        </div>
    );
}