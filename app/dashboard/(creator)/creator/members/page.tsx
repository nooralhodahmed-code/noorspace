import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function MembersManagementPage() {
    const supabase = await createClient();

    // 1. GET CURRENT CREATOR
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. FETCH MEMBERS LINKED TO THIS CREATOR
    // This query joins 'community_members' with 'profiles' to get real user data
    const { data: memberEntries, error } = await supabase
        .from('community_members')
        .select(`
            id,
            joined_at:created_at,
            profiles:user_id (
                id,
                display_name,
                avatar_url,
                whatsapp,
                role
            )
        `)
        // Assuming your 'communities' table links to creators, 
        // we'd filter by the community ID owned by this user
        .order('created_at', { ascending: false });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-8" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#111318] ">إدارة الأعضاء</h1>
                    <p className="text-[#111318] ">عرض وإدارة جميع المسجلين في "نور سبيس".</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn-secondary px-6 py-2 rounded-xl text-sm font-bold">
                        تصدير CSV
                    </button>
                    <button className="btn-primary px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                        إضافة عضو +
                    </button>
                </div>
            </div>

            {/* --- MEMBERS TABLE --- */}
            <div className="card-section overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9F5] ">
                                <th className="px-6 py-4 text-xs font-bold text-[#111318] ">العضو</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#111318] ">رقم التواصل</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#111318] ">الدور</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#111318] ">تاريخ الانضمام</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#111318] ">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 ">
                            {!memberEntries || memberEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-[#111318] ">
                                        لا يوجد أعضاء مسجلين في مجتمعك حالياً.
                                    </td>
                                </tr>
                            ) : (
                                memberEntries.map((entry: any) => {
                                    const profile = entry.profiles;
                                    return (
                                        <tr key={entry.id} className="hover:bg-[#F8F9F5]/50 ">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {profile?.avatar_url ? (
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt={profile.display_name}
                                                                className="w-10 h-10 rounded-full object-cover border border-black/5 "
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-offwhite flex items-center justify-center font-bold text-pistachio">
                                                            {profile?.display_name?.charAt(0) || "U"}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-[#111318] ">{profile?.display_name || "مستخدم جديد"}</p>
                                                        <p className="text-[10px] text-[#111318] ">معرف: {profile?.id?.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <a href={`https://wa.me/${profile?.whatsapp}`} className="text-xs font-bold text-pistachio hover:underline" dir="ltr">
                                                    {profile?.whatsapp || "—"}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${profile?.role === 'creator' ? 'bg-[#8CAB46]/10 text-[#8CAB46]' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {profile?.role === 'creator' ? 'منشئ' : 'عضو'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#111318] ">
                                                {formatDate(entry.joined_at)}
                                            </td>
                                            <td className="px-6 py-4 text-left">
                                                <button className="text-slate-text/80 hover:text-slate-text">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}