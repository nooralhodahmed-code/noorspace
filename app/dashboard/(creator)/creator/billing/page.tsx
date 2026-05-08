import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function BillingManagementPage() {
    const supabase = await createClient();

    // 1. AUTH & PROFILE CHECK
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from('profiles')
        .select('country')
        .eq('id', user.id)
        .single();

    // 2. CURRENCY LOGIC
    const getCurrency = (country: string | undefined) => {
        switch (country?.toLowerCase()) {
            case 'eg': return 'ج.م';
            case 'sa': return 'ر.س';
            default: return '$';
        }
    };
    const currency = getCurrency(profile?.country);

    // 3. FETCH FINANCIAL DATA
    const { data: payments } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    const { data: payouts } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });

    const totalRevenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
    const totalPaidOut = payouts?.filter(p => p.status === 'completed').reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
    const pendingBalance = totalRevenue - totalPaidOut;

    return (
        <div className="space-y-10" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-text">الفواتير والمدفوعات</h1>
                    <p className="text-slate-text/80">تتبع أرباحك وإدارة عمليات سحب المستحقات.</p>
                </div>

                <button className="btn-primary px-8 py-3 rounded-2xl font-bold shadow-sm hover:opacity-90 transition-all">
                    طلب سحب أرباح
                </button>
            </div>

            {/* --- FINANCIAL KPI GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "إجمالي الإيرادات", value: `${totalRevenue} ${currency}`, icon: "💰", color: "bg-pistachio/10 text-pistachio" },
                    { label: "الرصيد المتاح", value: `${pendingBalance} ${currency}`, icon: "🏦", color: "bg-mustard/10 text-mustard" },
                    { label: "تم سحبه", value: `${totalPaidOut} ${currency}`, icon: "💸", color: "bg-blue-slate/10 text-blue-slate" },
                ].map((stat) => (
                    <div key={stat.label} className="card-section p-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-bold text-[#111318] ">{stat.label}</p>
                        <p className="text-3xl font-black text-[#111318] ">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* --- RECENT TRANSACTIONS TABLE --- */}
            <div className="card-section overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-200 ">
                    <h3 className="font-bold text-xl text-slate-text">آخر العمليات</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-offwhite ">
                                <th className="px-10 py-5 text-xs font-bold text-slate-text/80">التاريخ</th>
                                <th className="px-10 py-5 text-xs font-bold text-slate-text/80">نوع العملية</th>
                                <th className="px-10 py-5 text-xs font-bold text-slate-text/80">الحالة</th>
                                <th className="px-10 py-5 text-xs font-bold text-slate-text/80">المبلغ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 ">
                            {!payments || payments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-[#111318] ">
                                        لا توجد عمليات مالية مسجلة حتى الآن.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-[#F8F9F5]/50 ">
                                        <td className="px-10 py-6 text-sm text-[#111318] ">
                                            {new Date(payment.created_at).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-10 py-6 font-bold text-sm text-[#111318] ">
                                            {payment.type === 'subscription' ? 'اشتراك عضوية' : 'شراء دورة'}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                                ناجحة
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-left font-black text-[#111318] " dir="ltr">
                                            + {payment.amount} {currency}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}