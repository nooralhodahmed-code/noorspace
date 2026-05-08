"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsClient({ userId, initialProfile, initialCommunity }: { userId: string, initialProfile: any, initialCommunity: any }) {
    const supabase = createClient();

    const [activeSection, setActiveSection] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile?.avatar_url || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(initialCommunity?.cover_url || null);

    const [formData, setFormData] = useState({
        full_name: initialProfile?.full_name || "",
        display_name: initialProfile?.display_name || "",
        bio: initialProfile?.bio || "",
        whatsapp: initialProfile?.whatsapp || "",
        avatar_url: initialProfile?.avatar_url || "",

        community_name: initialCommunity?.name || "",
        community_description: initialCommunity?.description || "",
        cover_url: initialCommunity?.cover_url || "",
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }),
            { rootMargin: "-20% 0px -70% 0px" }
        );
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((sec) => observer.observe(sec));
        return () => observer.disconnect();
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, bucket: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const objectUrl = URL.createObjectURL(file);
            if (bucket === 'avatars') setAvatarPreview(objectUrl);
            else if (bucket === 'covers') setCoverPreview(objectUrl);

            const fileExt = file.name.split('.').pop();
            const fileName = bucket === 'avatars' ? `${userId}-avatar.${fileExt}` : `${userId}-cover.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
            const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

            if (bucket === 'avatars') setFormData(prev => ({ ...prev, avatar_url: cacheBustedUrl }));
            else if (bucket === 'covers') setFormData(prev => ({ ...prev, cover_url: cacheBustedUrl }));

        } catch (error) {
            console.error("Upload error:", error);
            alert("حدث خطأ أثناء رفع الصورة.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error: profileError } = await supabase.from('profiles').update({
                full_name: formData.full_name,
                display_name: formData.display_name,
                bio: formData.bio,
                whatsapp: formData.whatsapp,
                avatar_url: formData.avatar_url
            }).eq('id', userId);

            if (profileError) throw profileError;

            const communityData = {
                owner_id: userId,
                name: formData.community_name,
                description: formData.community_description,
                cover_url: formData.cover_url,
                slug: initialCommunity?.slug || `space-${Date.now()}`
            };

            if (initialCommunity?.id) {
                const { error: communityError } = await supabase.from('communities').update(communityData).eq('id', initialCommunity.id);
                if (communityError) throw communityError;
            } else {
                const { error: communityError } = await supabase.from('communities').insert([communityData]);
                if (communityError) throw communityError;
            }

            alert("تم حفظ التغييرات بنجاح! ✅");
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("حدث خطأ أثناء الحفظ.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-10 relative pb-10 w-full">
            <aside className="w-full md:w-64 shrink-0 hidden md:block">
                <div className="sticky top-28 bg-white p-4 rounded-[32px] border border-black/5 shadow-sm space-y-1">
                    <p className="text-[10px] font-black text-[#111318]/30 uppercase tracking-widest px-4 mb-4 mt-2">
                        إعدادات المساحة
                    </p>
                    <a href="#profile" className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeSection === 'profile' ? 'bg-[#1e293b] text-white shadow-md' : 'text-[#111318]/60 hover:bg-[#F8F9F5]'}`}>
                        الملف الشخصي
                    </a>
                    <a href="#branding" className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeSection === 'branding' ? 'bg-[#1e293b] text-white shadow-md' : 'text-[#111318]/60 hover:bg-[#F8F9F5]'}`}>
                        هوية المجتمع
                    </a>
                </div>
            </aside>

            <div className="flex-1 space-y-16">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#111318]">
                        الإعدادات الشاملة
                    </h1>
                    <p className="text-[#111318]/40 text-sm mt-2">
                        إدارة تفاصيل حسابك وحفظها مباشرة في قاعدة البيانات.
                    </p>
                </div>

                <section id="profile" className="scroll-mt-32 space-y-6">
                    <h2 className="text-xl font-bold text-[#111318] flex items-center gap-3">👤 الملف الشخصي</h2>
                    <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
                        <div className="flex items-center gap-6">
                            <label className={`w-24 h-24 rounded-full bg-[#F8F9F5] border-2 border-dashed border-[#111318]/20 flex items-center justify-center text-3xl overflow-hidden relative group cursor-pointer hover:border-[#1e293b] transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover object-top" /> : "📷"}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold">تغيير</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatars')} disabled={isUploading} />
                            </label>
                            <div>
                                <p className="text-sm font-bold text-[#111318] mb-1">
                                    {isUploading ? 'جاري الرفع...' : 'تحديث الصورة الشخصية'}
                                </p>
                                <p className="text-[10px] text-[#111318]/40 font-bold">JPG, PNG (Max 2MB)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">الاسم الكامل</label>
                                <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">اسم العرض</label>
                                <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all shadow-inner" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">النبذة التعريفية</label>
                                <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all resize-none shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">رقم الواتساب</label>
                                <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all shadow-inner" dir="ltr" />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="branding" className="scroll-mt-32 space-y-6">
                    <h2 className="text-xl font-bold text-[#111318] flex items-center gap-3">🎨 هوية المجتمع</h2>
                    <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#111318]/40 mr-2">صورة الغلاف</label>
                            <label className={`w-full h-40 bg-[#F8F9F5] rounded-3xl border-2 border-dashed border-[#111318]/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#1e293b] transition-colors relative group overflow-hidden ${isUploading ? 'opacity-50' : ''}`}>
                                {coverPreview ? <img src={coverPreview} alt="cover" className="absolute inset-0 w-full h-full object-cover" /> : (
                                    <>
                                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🖼️</span>
                                        <span className="text-xs font-bold text-[#111318]/50">اضغط لرفع صورة الغلاف</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'covers')} disabled={isUploading} />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">اسم المجتمع</label>
                                <input type="text" value={formData.community_name} onChange={(e) => setFormData({ ...formData, community_name: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all shadow-inner" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-[#111318]/40 mr-2">وصف المجتمع</label>
                                <textarea rows={2} value={formData.community_description} onChange={(e) => setFormData({ ...formData, community_description: e.target.value })} className="w-full bg-[#F8F9F5] border-none rounded-2xl p-4 font-bold text-[#111318] focus:ring-2 focus:ring-[#1e293b] outline-none transition-all resize-none shadow-inner" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-4 pt-8 border-t border-black/5">
                    <button type="button" onClick={() => window.location.reload()} className="text-[#111318]/40 hover:text-[#111318] px-6 py-3 rounded-2xl font-bold transition-colors">
                        تجاهل التغييرات
                    </button>
                    <button onClick={handleSave} disabled={isSaving || isUploading} className="bg-[#1e293b] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#0f172a] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>
        </div>
    );
}
