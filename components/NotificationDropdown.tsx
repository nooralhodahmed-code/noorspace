"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

// 1. Tell TypeScript about the prop we are passing from layout.tsx
interface NotificationDropdownProps {
    unreadCount?: number;
}

export default function NotificationDropdown({ unreadCount = 0 }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Local state to handle the "Mark as read" UI update instantly
    const [localUnread, setLocalUnread] = useState(unreadCount);

    // Keep local state in sync if the database count changes
    useEffect(() => {
        setLocalUnread(unreadCount);
    }, [unreadCount]);

    // 2. Mark as read function
    const markAsRead = async () => {
        // Here you would add your Supabase client call to update the DB later
        // e.g., await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);

        // Hide the red dot instantly for the user
        setLocalUnread(0);
    };

    return (
        <div className="relative">
            {/* 3. Updated Bell Button with Red Dot */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-all cursor-pointer ${isOpen
                        ? 'bg-[#1A1F2B] text-white border-[#1A1F2B]'
                        : 'bg-white text-slate-text hover:bg-[#1A1F2B] hover:text-white hover:border-[#1A1F2B]'
                    }`}
            >
                <Bell size={18} />
                {localUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {localUnread}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-0 mt-3 w-80 bg-white rounded-[32px] shadow-xl border border-slate-100 z-20 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-black text-sm text-[#111318]">التنبيهات</span>

                            {/* 4. Added "Mark as Read" and styled "View All" */}
                            <div className="flex gap-4 items-center">
                                {localUnread > 0 && (
                                    <button
                                        onClick={markAsRead}
                                        className="text-[10px] font-bold text-slate-text/50 hover:text-pistachio flex items-center gap-1 transition-colors"
                                    >
                                        <CheckCheck size={14} />
                                        تحديد كمقروء
                                    </button>
                                )}
                                <Link href="/dashboard/creator/notifications" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-pistachio hover:underline">
                                    عرض الكل
                                </Link>
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            <div className="p-6 text-center text-slate-text/40 text-xs font-bold">
                                لا توجد تنبيهات جديدة حالياً.
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}