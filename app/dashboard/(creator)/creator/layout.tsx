import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NotificationDropdown from "../../../../components/NotificationDropdown";
import Logo from "../../../../components/Logo";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    UserPlus,
    TrendingUp,
    CreditCard,
    Settings,
    HelpCircle,
    MessageSquare,
    CalendarDays
} from "lucide-react";

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from('profiles').select('role, display_name, avatar_url').eq('id', user.id).single();
    if (profile?.role !== 'creator') redirect("/dashboard");

    const firstName = profile?.display_name?.split(' ')[0] || "";

    // Fetch functional unread counts (Adjust table names if your schema is different)
    const { count: unreadMessages } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('is_read', false);
    const { count: unreadNotifications } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false);

    const navLinks = [
        { name: "نظرة عامة", href: "/dashboard/creator", icon: <LayoutDashboard size={20} /> },
        { name: "المجتمعات", href: "/dashboard/creator/communities", icon: <Users size={20} /> },
        { name: "الدورات", href: "/dashboard/creator/courses", icon: <BookOpen size={20} /> },
        { name: "الأحداث", href: "/dashboard/creator/events", icon: <CalendarDays size={20} /> },
        { name: "الأعضاء", href: "/dashboard/creator/members", icon: <UserPlus size={20} /> },
        { name: "الإحصائيات", href: "/dashboard/creator/analytics", icon: <TrendingUp size={20} /> },
        { name: "الفواتير", href: "/dashboard/creator/billing", icon: <CreditCard size={20} /> },
    ];

    return (
        <div className="min-h-screen flex w-full">
            <aside className="w-72 bg-[#1A1F2B] border-r border-slate-800/50 shadow-sm flex flex-col">
                <div className="p-8 text-white">
                    <Logo className="text-3xl" />
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 flex flex-col">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group w-fit flex items-center gap-4 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span className="text-sm font-medium">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 flex gap-2">
                    <Link href="/dashboard/creator/settings" title="الإعدادات" className="w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                        <Settings size={20} />
                    </Link>
                    <Link href="/dashboard/creator/support" title="الدعم الفني" className="w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                        <HelpCircle size={20} />
                    </Link>
                </div>
            </aside>

            <main className="flex-1 flex flex-col w-full overflow-x-hidden bg-offwhite">
                <header className="h-20 bg-white/90 border-b border-slate-200/70 px-10 flex items-center justify-between">
                    <span className="text-xl font-black text-[#1A1F2B]">
                        أهلاً، {firstName} 👋
                    </span>
                    <div className="flex items-center gap-3">

                        {/* Messages Button with Red Dot */}
                        <Link href="/dashboard/creator/messages" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-text hover:bg-[#1A1F2B] hover:text-white hover:border-[#1A1F2B] transition-all border border-slate-200 cursor-pointer">
                            <MessageSquare size={18} />
                            {(unreadMessages ?? 0) > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                    {unreadMessages}
                                </span>
                            )}
                        </Link>

                        {/* We are passing the notification count to the dropdown now */}
                        <NotificationDropdown unreadCount={unreadNotifications ?? 0} />

                        <Link href="/dashboard/creator/settings" className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow transition-all bg-white flex items-center justify-center">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover object-top" />
                            ) : (
                                <span className="text-[#1A1F2B] font-bold text-sm">{firstName.charAt(0)}</span>
                            )}
                        </Link>
                    </div>
                </header>
                <div className="p-10 flex justify-center w-full">
                    <div className="w-full max-w-5xl">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}