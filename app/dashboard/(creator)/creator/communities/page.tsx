import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CommunitiesManagementPage() {
    const supabase = await createClient();

    // 1. AUTH CHECK
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. FETCH REAL COMMUNITIES
    // We fetch communities and the count of members in each
    const { data: communities, error } = await supabase
        .from('communities')
        .select(`
      id,
      name,
      description,
      created_at,
      community_members (id)
    `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-text">إدارة المجتمعات</h1>
                    <p className="text-slate-text/80">عرض وتنظيم المجموعات النشطة داخل مساحتك.</p>
                </div>

                <button className="btn-primary px-8 py-3 rounded-2xl font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer">
                    إنشاء مجتمع جديد +
                </button>
            </div>

            {/* --- COMMUNITIES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!communities || communities.length === 0 ? (
                    <div className="col-span-full card-section p-8">
                        <div className="text-5xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold text-slate-text">لا توجد مجتمعات حالياً</h3>
                        <p className="text-slate-text/80">ابدأ بإنشاء أول مجتمع لجمع أعضائك وبناء التفاعل.</p>
                    </div>
                ) : (
                    communities.map((community: any) => (
                        <div key={community.id} className="card-section overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-3xl bg-offwhite flex items-center justify-center text-3xl">
                                        🏘️
                                    </div>
                                    <span className="text-[11px] font-black bg-[#8CAB46]/10 text-[#8CAB46] px-3 py-1 rounded-full">
                                        {community.community_members?.length || 0} عضو
                                    </span>
                                </div>

                                <h3 className="font-bold text-xl text-slate-text">{community.name}</h3>
                                <p className="text-xs text-slate-text/80">
                                    {community.description || "لا يوجد وصف لهذا المجتمع."}
                                </p>

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <div className="flex gap-4">
                                        <button className="text-[11px] font-bold text-slate-text/80">الإعدادات</button>
                                    </div>
                                    <button className="mt-3 btn-secondary px-5 py-3 font-bold">
                                        عرض المجتمع
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}