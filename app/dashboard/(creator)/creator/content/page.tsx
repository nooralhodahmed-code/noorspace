import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ContentManagementPage() {
    const supabase = await createClient();

    // 1. AUTH CHECK
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. FETCH REAL COURSES
    // We fetch courses and count associated chapters/lessons via joins
    const { data: courses, error } = await supabase
        .from('courses')
        .select(`
      id,
      title,
      description,
      created_at,
      chapters (id),
      lessons (id)
    `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-text">إدارة المحتوى</h1>
                    <p className="text-slate-text/80">تنظيم الدورات التدريبية والمناهج الخاصة بـ noOrSpace.</p>
                </div>

                <button className="btn-primary px-8 py-3 rounded-2xl font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer">
                    إنشاء دورة جديدة +
                </button>
            </div>

            {/* --- COURSES GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!courses || courses.length === 0 ? (
                    <div className="col-span-full card-section p-8">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-slate-text">لا توجد دورات تدريبية حالياً</h3>
                        <p className="text-slate-text/80">ابدأ بإضافة دورتك الأولى لبناء مكتبة المحتوى الخاصة بك.</p>
                    </div>
                ) : (
                    courses.map((course: any) => (
                    <div className="card-section overflow-hidden">
                            {/* Course Thumbnail Placeholder */}
                            <div className="h-44 bg-offwhite rounded-t-3xl flex items-center justify-center text-7xl">
                                📦
                            </div>

                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-black bg-[#8CAB46]/10 text-[#8CAB46] px-2 py-1 rounded-lg">
                                            {course.chapters?.length || 0} فصول
                                        </span>
                                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                                            {course.lessons?.length || 0} دروس
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-xl text-slate-text">{course.title}</h3>
                                <p className="text-xs text-slate-text/80">
                                    {course.description || "لا يوجد وصف لهذه الدورة."}
                                </p>

                                <div className="mt-8 pt-6 border-t border-black/5 ">
                                    <div className="flex gap-4">
                                        <button className="text-[11px] font-bold text-slate-text/80">تعديل</button>
                                        <button className="text-[11px] font-bold text-red-500 hover:text-red-600 cursor-pointer">حذف</button>
                                    </div>
                                    <button className="text-xs font-black text-[#111318] ">
                                        إدارة المحتوى
                                        <span>←</span>
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