import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreatorChart from "@/components/CreatorChart";

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // 1. AUTH CHECK
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. FETCH REAL DATA ONLY
    const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

    const { count: completedLessons } = await supabase
        .from('lesson_completions')
        .select('*', { count: 'exact', head: true });

    const { data: payments } = await supabase.from('payments').select('amount');
    const totalRevenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    // 3. DATA VALIDATION
    const hasData = (totalEnrollments || 0) > 0 || (completedLessons || 0) > 0;

    const engagementData = hasData ? [
        { name: "التسجيلات", value: totalEnrollments || 0 },
        { name: "الإكمال", value: completedLessons || 0 },
    ] : [];

    return (
        <div className="space-y-10" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-text">الإحصائيات التحليلية</h1>
                <p className="text-slate-text/80">بيانات حقيقية من قاعدة بيانات noOrSpace.</p>
            </div>

            {/* --- REAL KPI ROW --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "إجمالي التسجيلات", value: totalEnrollments || 0, icon: "🎓", color: "bg-blue-slate/10 text-blue-slate" },
                    { label: "الدروس المكتملة", value: completedLessons || 0, icon: "✅", color: "bg-pistachio/10 text-pistachio" },
                    { label: "القيمة الإجمالية", value: `${totalRevenue} ج.م`, icon: "💰", color: "bg-mustard/10 text-mustard" },
                ].map((item) => (
                    <div key={item.label} className="card-section p-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${item.color}`}>
                            {item.icon}
                        </div>
                        <p className="text-xs font-bold text-[#111318] ">{item.label}</p>
                        <p className="text-3xl font-black text-[#111318] ">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* --- CHART SECTION with EMPTY STATE --- */}
            <div className="card-section p-6">
                <h3 className="font-bold text-xl text-slate-text">مؤشرات التفاعل</h3>

                {hasData ? (
                    <div className="h-[350px]">
                        <CreatorChart data={engagementData} />
                    </div>
                ) : (
                    <div className="h-[350px] flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-20 h-20 rounded-3xl bg-offwhite flex items-center justify-center text-4xl">📈</div>
                        <p className="text-slate-text">لا توجد بيانات تفاعل حالياً</p>
                        <p className="text-slate-text/70 max-w-xl">بمجرد أن يبدأ الأعضاء في التسجيل وإكمال الدروس، ستظهر الرسوم البيانية هنا تلقائياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}