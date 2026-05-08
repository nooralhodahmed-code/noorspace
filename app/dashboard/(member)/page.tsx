import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
    // 1. In the next step, we will fetch real posts from Supabase here
    // const supabase = await createClient();
    // const { data: posts } = await supabase.from('posts').select('*');

    return (
        <div className="max-w-[760px] mx-auto space-y-6 pb-20">

            {/* ── Create Post Input (Static UI for now) ── */}
            <div className="card-section p-5">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111318]/5 to-[#111318]/10 shrink-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#111318]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <button className="flex-1 bg-[#F8F7F4] hover:bg-[#f0efeb] transition-colors rounded-xl px-5 text-right text-sm text-[#111318]/40 outline-none flex items-center">
                        بم تفكر؟ شارك مع المجتمع...
                    </button>
                </div>
                <div className="mt-4 pt-4 border-t border-[#111318]/5 flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-[#111318]/5 text-[#111318]/40 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <button className="px-5 py-2 btn-primary text-sm font-bold rounded-xl transition-colors">
                        نشر
                    </button>
                </div>
            </div>

            {/* ── Feed Filters ── */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                <button className="px-4 py-2 bg-offwhite rounded-xl text-sm font-bold text-slate-text shadow-sm border border-slate-200">
                    الأحدث
                </button>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-[#111318]/40 hover:bg-[#111318]/5 hover:text-[#111318]/80 transition-colors">
                    الأكثر تفاعلاً
                </button>
            </div>

            {/* ── Placeholder Post (Empty State) ── */}
            <div className="card-section p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pistachio to-mustard flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            N
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[#111318]">فريق noOrSpace</p>
                            <p className="text-[11px] text-[#111318]/40 mt-0.5">منذ دقيقتين • الإعلانات</p>
                        </div>
                    </div>
                    <button className="text-[#111318]/30 hover:text-[#111318]/80 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#111318]">أهلاً بك في مساحتك الجديدة! 🎉</h3>
                    <p className="text-[#111318]/70 text-sm leading-relaxed">
                        هذه هي واجهة المجالس (Feed) الخاصة بك. بمجرد أن يبدأ الأعضاء في النشر، ستظهر محادثاتهم وأسئلتهم هنا. في الخطوة القادمة، سنقوم بربط هذه الواجهة بقاعدة بيانات Supabase لتعمل بشكل حقيقي.
                    </p>
                </div>

                <div className="pt-4 border-t border-[#111318]/5 flex items-center gap-6">
                    <button className="flex items-center gap-2 text-[#111318]/40 hover:text-[#8CAB46] transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        <span>إعجاب (0)</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#111318]/40 hover:text-[#111318]/80 transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span>تعليق (0)</span>
                    </button>
                </div>
            </div>

        </div>
    );
}