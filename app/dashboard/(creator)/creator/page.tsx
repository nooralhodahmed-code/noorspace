import { createClient } from "@/utils/supabase/server";
import { Wallet, Users, Repeat, BookOpen, Bell } from "lucide-react";

export default async function CreatorDashboardPage() {
    const supabase = await createClient();

    // 1. DATA FETCHING
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('country').eq('id', user?.id).single();

    // Core Metrics Fetching
    // FIX: Only count users where the role is 'member' (excludes the creator)
    const { count: memberCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member');

    // Note: Adjust 'subscriptions' and 'courses' table names based on your actual schema
    const { count: activeSubsCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published');

    // Fetch payments for total revenue
    const { data: payments } = await supabase.from('payments').select('amount, type');
    const totalRevenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
    const currency = profile?.country === 'EG' ? 'ج.م' : '$';

    // Fetch recent events/notifications (Adjust 'creator_events' table name to your schema)
    const { data: recentEvents } = await supabase.from('creator_events').select('*').order('created_at', { ascending: false }).limit(5);

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-extrabold text-slate-text">الملخص</h1>

            {/* Functional KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-text/70">إجمالي الإيرادات</p>
                        <div className="w-10 h-10 rounded-xl bg-pistachio/10 flex items-center justify-center text-pistachio">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#111318]">{totalRevenue} {currency}</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-text/70">إجمالي الأعضاء</p>
                        <div className="w-10 h-10 rounded-xl bg-slate-800/10 flex items-center justify-center text-slate-800">
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#111318]">{memberCount || 0}</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-text/70">الاشتراكات النشطة</p>
                        <div className="w-10 h-10 rounded-xl bg-mustard/10 flex items-center justify-center text-mustard">
                            <Repeat size={20} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#111318]">{activeSubsCount || 0}</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-text/70">الدورات المنشورة</p>
                        <div className="w-10 h-10 rounded-xl bg-slate-800/10 flex items-center justify-center text-slate-800">
                            <BookOpen size={20} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-[#111318]">{coursesCount || 0}</h4>
                    </div>
                </div>
            </div>

            {/* --- RECENT EVENTS / NOTIFICATIONS HUB --- */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#111318]">الأحداث والإشعارات</h3>
                        <p className="text-slate-text/70 text-sm mt-1">آخر النشاطات في مجتمعك ودوراتك</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <Bell size={20} />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {recentEvents && recentEvents.length > 0 ? (
                        recentEvents.map((event) => (
                            <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-pistachio mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-[#111318]">{event.title}</p>
                                    <p className="text-xs text-slate-text/60 mt-1">{event.description}</p>
                                    <span className="text-[10px] text-slate-text/40 mt-2 block">
                                        {new Date(event.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-text/50 text-sm">
                            لا توجد أحداث جديدة في الوقت الحالي.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}