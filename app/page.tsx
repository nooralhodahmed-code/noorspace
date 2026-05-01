"use client";

import { useState } from "react";
// --- NEW IMPORT: Our Supabase Google Sign-In Component ---
import GoogleSignIn from "@/components/GoogleSignIn";

// --- 1. DATA CONSTANTS ---

const CATEGORIES = [
  { name: "الكل", icon: "🌐" },
  { name: "الأعمال", icon: "💼" },
  { name: "التصميم", icon: "🎨" },
  { name: "البرمجة", icon: "💻" },
  { name: "التسويق", icon: "📈" },
  { name: "الصحة", icon: "🍎" },
  { name: "الرياضة", icon: "⚽" },
  { name: "الروحانيات", icon: "🧘" },
  { name: "تطوير الذات", icon: "🚀" },
  { name: "المال", icon: "💰" },
  { name: "الهوايات", icon: "🧩" },
  { name: "الموسيقى", icon: "🎸" },
];

const COMMUNITIES = [
  {
    id: 1,
    title: "أكاديمية صناع المحتوى",
    desc: "المكان الأول لتعلم كيفية بناء جمهور وتحقيق دخل من شغفك.",
    category: "الأعمال",
    members: "1.3k",
    price: "$49/شهر",
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
    rating: 4.8
  },
  {
    id: 2,
    title: "مجتمع المصممين العرب",
    desc: "شارك أعمالك، احصل على تغذية راجعة، وتطور في مسارك المهني.",
    category: "التصميم",
    members: "850",
    price: "مجانًا",
    cover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=200&fit=crop",
    rating: 4.3
  },
  {
    id: 3,
    title: "مطورين الويب المتقدم",
    desc: "نقاشات تقنية، حلول برمجية، ومراجعة أكواد بشكل أسبوعي.",
    category: "البرمجة",
    members: "348.9k",
    price: "مجانًا",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 4.9
  },
  {
    id: 4,
    title: "أسرار التسويق الرقمي",
    desc: "استراتيجيات التسويق الحديثة، دراسات حالة، وحملات إعلانية ناجحة.",
    category: "التسويق",
    members: "1k",
    price: "$9/شهر",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    rating: 4.6
  },
  {
    id: 5,
    title: "نادي رواد الأعمال",
    desc: "تواصل مع مؤسسي الشركات الناشئة، شارك التحديات، وابحث عن مستثمرين.",
    category: "الأعمال",
    members: "5.2k",
    price: "$99/شهر",
    cover: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    rating: 4.2
  },
  {
    id: 6,
    title: "أكاديمية اللياقة الشاملة",
    desc: "برامج تدريبية، أنظمة غذائية، ودعم مجتمعي للوصول إلى هدفك الصحي.",
    category: "الصحة",
    members: "12k",
    price: "$15/شهر",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop",
    rating: 4.7
  }
];

const TESTIMONIALS = [
  { name: "فاطمة البدري", quote: "\"حققت $3000 في أول شهر.\"", vid: "https://videos.pexels.com/video-files/5982186/5982186-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop" },
  { name: "علي العمري", quote: "\"noOrSpace غيّرت حياتي المهنية.\"", vid: "https://videos.pexels.com/video-files/6968798/6968798-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=600&fit=crop" },
  { name: "يوسف منصور", quote: "\"أفضل منصة لإدارة مجتمعي الرقمي.\"", vid: "https://videos.pexels.com/video-files/8091807/8091807-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=600&fit=crop" },
  { name: "سارة خالد", quote: "\"سهولة تامة في استقبال المدفوعات.\"", vid: "https://videos.pexels.com/video-files/6313467/6313467-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1544717297-fa154da09f13?w=400&h=600&fit=crop" },
  { name: "خالد سعيد", quote: "\"ابني جمهورك الحقيقي بدون خوارزميات.\"", vid: "https://videos.pexels.com/video-files/3888289/3888289-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop" },
  { name: "نورة حسن", quote: "\"أخيراً مكان منظم لكل دوراتي.\"", vid: "https://videos.pexels.com/video-files/7021516/7021516-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=400&h=600&fit=crop" },
  { name: "سلطان العتيبي", quote: "\"مصدر دخل إضافي ممتاز.\"", vid: "https://videos.pexels.com/video-files/8470557/8470557-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=600&fit=crop" },
  { name: "أروى محمد", quote: "\"مجتمعي التفاعلي ينمو كل يوم.\"", vid: "https://videos.pexels.com/video-files/7650393/7650393-uhd_1440_2160_25fps.mp4", posterImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop" },
];

// --- 2. DYNAMIC ANIMATED LOGO COMPONENT ---

const AnimatedLogo = ({ className = "" }: { className?: string }) => {
  return (
    <span className={`group inline-flex items-center font-heading font-bold tracking-tight cursor-default ${className}`} dir="ltr">
      <style jsx>{`
        @keyframes eye-movement {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(0, -15%); }
          15% { transform: translate(0, 0); }
          40% { transform: translate(0, 0); }
          45% { transform: translate(-10%, 0); }
          55% { transform: translate(-10%, 0); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(15%, 0); }
          75% { transform: translate(0, 0); }
        }
        .animate-eyes {
          display: inline-block;
          animation: eye-movement 5s ease-in-out infinite;
        }
        .delay-slight {
          animation-delay: 0.05s;
        }
      `}</style>

      <span className="text-pistachio flex items-baseline">
        n
        <span className="animate-eyes mx-[0.05em]">o</span>
        <span className="animate-eyes delay-slight mx-[0.05em]">O</span>
        r
      </span>

      <span className="relative flex items-center overflow-hidden h-[1.2em] w-[2.7em] ml-[0.05em]">
        <span className="absolute inset-0 flex items-center text-mustard transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-[100%] group-hover:opacity-0">
          Space
        </span>
        <span className="absolute inset-0 flex items-center justify-start text-mustard transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[0.9em] h-[0.9em] ml-[0.1em]">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
          </svg>
        </span>
      </span>
    </span>
  );
};

// --- 3. MAIN COMPONENT ---

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // NEW STATE: Added for Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredCommunities = COMMUNITIES.filter(
    (c) => activeCategory === "الكل" || c.category === activeCategory
  );

  return (
    <main className="bg-off-white selection:bg-pistachio/30">

      {/* SINGLE CLEAN NAVIGATION - Fully Mobile Responsive */}
      <nav className="absolute top-6 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none" dir="rtl">
        <div className="max-w-7xl w-full bg-slate-950 border border-slate-800 shadow-2xl rounded-2xl px-6 py-4 flex flex-col pointer-events-auto relative">

          {/* Top Bar (Always Visible) */}
          <div className="flex items-center justify-between">
            <a href="/">
              <AnimatedLogo className="text-2xl md:text-3xl hover:opacity-90 transition-opacity" />
            </a>

            {/* Desktop Menu Items */}
            <div className="hidden md:flex items-center gap-8 font-heading font-medium text-slate-300">
              <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-white transition-colors">المجتمعات</a>
              <a href="#" className="hover:text-white transition-colors">الأسعار</a>
              <a href="#" className="hover:text-white transition-colors">خدمة العملاء</a>
            </div>

            {/* Actions & Hamburger */}
            <div className="flex items-center gap-3">
              {/* UPDATED: Link to the dedicated login page */}
              <a
                href="/login"
                className="hidden sm:block text-slate-300 hover:text-white px-4 py-2 font-heading font-medium transition-colors"
              >
                تسجيل الدخول
              </a>

              <a
                href="/signup"
                className="bg-pistachio text-slate-950 px-5 py-2.5 rounded-xl font-heading font-bold text-sm hover:opacity-90 transition-all shadow-md"
              >
                إنشاء حساب
              </a>

              {/* Mobile Hamburger Button */}
              <button
                className="md:hidden p-2 text-slate-300 hover:text-white ml-[-8px]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
            <div className="flex flex-col p-4 space-y-4 text-center">
              <a href="#" className="text-slate-300 hover:text-white font-heading font-medium text-lg">الرئيسية</a>
              <a href="#" className="text-slate-300 hover:text-white font-heading font-medium text-lg">المجتمعات</a>
              <a href="#" className="text-slate-300 hover:text-white font-heading font-medium text-lg">الأسعار</a>
              <a href="#" className="text-slate-300 hover:text-white font-heading font-medium text-lg">خدمة العملاء</a>
              <hr className="border-slate-800 my-2 w-1/2 mx-auto" />

              {/* UPDATED: Mobile Login Link */}
              <a
                href="/login"
                className="text-slate-300 hover:text-white font-heading font-medium pb-2 text-lg"
              >
                تسجيل الدخول
              </a>
            </div>
          </div>

        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center HeroSection pt-48 lg:pt-56">
        <div className="max-w-7xl mx-auto HeroContainer">

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 font-heading leading-tight">
            مجتمعات تفاعلية تلهمك.. <span className="text-pistachio">لتتعلم، وتشارك، وتنمو</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-body">
            المنصة العربية الأفضل للمجتمعات الرقمية. شارك خبراتك وابن مصدر دخل مستدام، أو اكتشف مجتمعات تلبي شغفك وتطور مهاراتك في بيئة تفاعلية متكاملة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 HeroButtons">
            <button className="bg-pistachio text-white px-10 py-4 rounded-xl font-semibold shadow-lg text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              أنشئ مجتمعك مجاناً
            </button>
            <button className="border-2 border-mustard text-mustard px-10 py-4 rounded-xl font-semibold text-lg hover:bg-mustard hover:text-white hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              استكشف المجتمعات
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center -space-x-3 space-x-reverse" dir="rtl">
              {[
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm relative z-0"
                  alt="Creator"
                  loading="lazy"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm relative z-10">
                +1k
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="flex items-center gap-1 text-yellow-400 text-lg tracking-widest drop-shadow-sm" dir="ltr">
                ★★★★★
              </div>
              <p className="text-slate-600 font-body text-sm mt-1">
                موثوق من قبل أكثر من <span className="font-bold text-slate-800">7,495</span> صانع محتوى عربي
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section className="py-24 bg-white AboutSection">
        <div className="max-w-5xl mx-auto px-6 AboutContainer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="w-full text-right space-y-4 order-last lg:order-first AboutText">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800">
                ما هي <AnimatedLogo />؟
              </h2>
              <h3 className="text-base lg:text-lg font-heading font-bold text-slate-800/90 leading-snug">
                المقر الرقمي المتكامل لإدارة مجتمعات المبدعين في المنطقة.
              </h3>
              <p className="text-sm lg:text-base text-slate-600 leading-relaxed font-body">
                من بناء المساحات النقاشية والدورات التدريبية إلى تنظيم الفعاليات، استلام المدفوعات المحلية، وإدارة المشتركين؛ تمنحك <AnimatedLogo className="mx-1" /> كل ما تحتاجه لتنمية عملك القائم على المجتمع تحت مظلة واحدة وعلامة تجارية تملكها بالكامل.
              </p>
              <div className="pt-2">
                <button className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-slate-900 transition-all text-sm">
                  ابدأ تجربتك المجانية
                </button>
              </div>
            </div>

            <div className="w-full AboutVideoWrapper">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group bg-slate-100 border border-slate-200 AboutVideo">
                {!isVideoPlaying ? (
                  <div className="w-full h-full cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop" alt="Platform" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 hover:scale-105 transition-all">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-slate-900 border-b-[5px] border-b-transparent translate-x-[1px]"></div>
                      </div>
                      <span className="text-white font-heading font-semibold text-sm pl-1 tracking-wide">تشغيل</span>
                    </div>
                  </div>
                ) : (
                  <iframe className="w-full h-full" src="https://www.youtube.com/embed/19CFVE4ckzs?autoplay=1" title="Community Platform" allowFullScreen></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES SHOWCASE */}
      <section className="py-24 bg-slate-900 FeaturesSection">
        <div className="max-w-6xl mx-auto px-6 text-center FeaturesContainer">
          <div className="max-w-3xl mx-auto mb-16 space-y-4 FeaturesHeader">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-lg md:text-xl text-slate-400 font-body leading-relaxed">
              لا داعي للتنقل بين أدوات متعددة. <AnimatedLogo className="mx-1" /> تمنحك منصة متكاملة لتشغيل وإدارة وتنمية مجتمعك.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 FeaturesTabs">
            {["المجتمعات", "المحادثات", "البث والاجتماعات", "التلعيب", "لوحة الصدارة", "المدفوعات"].map((title, index) => (
              <button
                key={title}
                onClick={() => setActiveTab(index)}
                className={`px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all border ${activeTab === index ? "bg-white/10 text-white border-white/20" : "text-slate-400 border-transparent hover:text-white"
                  }`}
              >
                {title}
              </button>
            ))}
          </div>

          <div className="mx-auto w-full max-w-5xl rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-2 sm:p-3 FeaturesMockup">
            <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden">
              <img
                src={[
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
                  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
                  "https://images.unsplash.com/photo-1588196749597-9ff046f6fbab?w=1200&h=800&fit=crop",
                  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=800&fit=crop",
                  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&h=800&fit=crop",
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop"
                ][activeTab]}
                alt="Feature Showcase"
                className="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PERSONAS */}
      <section className="py-24 bg-off-white PersonasSection">
        <div className="max-w-5xl mx-auto px-6 PersonasContainer">
          <h2 className="text-4xl font-heading font-bold text-center mb-20 text-slate-800">
            <AnimatedLogo className="mx-2" /> صُممت خصيصًا من أجل:
          </h2>
          <div className="space-y-16 lg:space-y-24 PersonasGrid">
            {[
              { title: "صناع المحتوى المبدعون", desc: "ابنِ جمهورك الخاص بعيدًا عن فوضى الخوارزميات. استضف نقاشات تفاعلية، انشر محتوى حصريًا، وابدأ في تحقيق أرباح من شغفك تحت مظلة علامتك التجارية.", color: "text-pistachio", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" },
              { title: "المتعلمون الطموحون", desc: "اكتشف مجتمعات تعليمية تلبي شغفك وتطور مهاراتك. انضم إلى دورات تدريبية، ورش عمل مباشرة، وتواصل مع خبراء مجالك في بيئة تفاعلية منظمة.", color: "text-mustard", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" },
              { title: "المحترفون والخبراء", desc: "حوّل خبرتك المهنية إلى مصدر دخل مستدام. قَدّم استشارات فردية، قم ببناء شبكة علاقات قوية، وأسس أكاديميتك الرقمية الخاصة لتنظيم جلساتك وخدماتك بسهولة.", color: "text-pistachio", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800" },
            ].map((p, i) => (
              <div key={i} className={`flex flex-col md:items-center gap-10 lg:gap-16 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} PersonaRow`}>
                <div className="flex-1 text-center flex flex-col items-center space-y-4 PersonaText">
                  <h3 className="text-3xl font-heading font-bold text-slate-800"><span className={p.color}>✦</span> {p.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-body">{p.desc}</p>
                </div>
                <div className="flex-1 rounded-2xl aspect-[16/10] overflow-hidden shadow-xl PersonaImage">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: DISCOVER COMMUNITIES */}
      <section className="py-24 bg-white DiscoverSection">
        <div className="max-w-5xl mx-auto px-6 DiscoverContainer">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-slate-800 text-center mb-10 DiscoverTitle">استكشف المجتمعات</h2>

          <div className="flex flex-wrap justify-center gap-2 mb-10 DiscoverCategories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-heading text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === cat.name ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <span>{cat.icon}</span><span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end mb-4 DiscoverLinkWrapper">
            <a href="/discover" className="group flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm DiscoverLink">
              <span className="ml-1">تصفح كل المجتمعات</span>
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 DiscoverGrid">
            {filteredCommunities.slice(0, 6).map((community) => (
              <div key={community.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group border border-slate-100 CommunityCard">

                <div className="h-44 w-full bg-slate-200 overflow-hidden CommunityCardCover">
                  <img src={community.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>

                <div className="p-5 flex-1 flex flex-col CommunityCardContent">
                  <div className="flex items-start gap-4 mb-3 CommunityCardHeader">
                    <img src={community.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100 CommunityCardLogo" loading="lazy" />
                    <div className="flex flex-col CommunityCardTitleWrapper">
                      <h3 className="font-heading font-bold text-lg text-slate-800 line-clamp-1 leading-tight mb-1 CommunityCardTitle">{community.title}</h3>

                      <div className="flex items-center gap-1.5 mt-0.5 CommunityCardRating">
                        <span className="text-sm font-bold text-slate-700">{community.rating}</span>
                        <div className="relative inline-block text-slate-200 text-sm tracking-widest" dir="ltr">
                          ★★★★★
                          <div
                            className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                            style={{ width: `${(community.rating / 5) * 100}%` }}
                          >
                            ★★★★★
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 CommunityCardDesc">{community.desc}</p>

                  <div className="flex items-center justify-between text-sm font-bold pt-4 border-t border-slate-50 mt-auto CommunityCardStats">
                    <div className="text-slate-500 CommunityCardMembers">
                      {community.members} أعضاء
                    </div>
                    <span className="text-slate-700 CommunityCardPrice">
                      {community.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF */}
      <section className="py-24 bg-off-white overflow-hidden SocialProofSection">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-3 SocialProofHeader">
          <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight SocialProofTitle">
            <span className="text-slate-800">صنّاع</span>{" "}
            <span className="text-pistachio">يثقون</span>{" "}
            <span className="text-mustard">بنا</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-body max-w-2xl mx-auto leading-relaxed SocialProofSubtitle">
            انضم إلى نخبة صناع المحتوى العرب الذين حوّلوا شغفهم إلى مصدر دخل مستدام.
          </p>
        </div>

        <style jsx global>{`
          @keyframes scrollRTL { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-200px * 8 - 1.5rem * 8)); } }
          .animate-scroll-slow-rtl { animation: scrollRTL 40s linear infinite; }
          .group:hover .animate-scroll-slow-rtl { animation-play-state: paused; }
        `}</style>

        <div className="w-full flex group SocialProofCarousel" dir="ltr">
          <div className="flex gap-6 animate-scroll-slow-rtl flex-nowrap pr-6 SocialProofTrack">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => (
              <div
                key={index}
                className="relative w-[200px] shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 SocialProofCard"
              >
                <video
                  className="absolute inset-0 w-full h-full object-cover SocialProofCardVideo"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={testimonial.posterImg}
                >
                  <source src={testimonial.vid} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent SocialProofCardOverlay"></div>

                <div className="absolute bottom-5 right-5 left-5 text-right space-y-1 SocialProofCardText" dir="rtl">
                  <h3 className="font-heading font-bold text-base text-white tracking-tight SocialProofCardName">
                    {testimonial.name}
                  </h3>
                  <p className="font-body text-sm font-semibold leading-snug text-slate-200 SocialProofCardQuote">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="relative py-32 lg:py-48 bg-slate-900 overflow-hidden flex items-center justify-center w-full">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-white/40"></div>
          <div className="absolute w-[650px] h-[650px] rounded-full border border-dashed border-white/30"></div>
          <div className="absolute w-[950px] h-[950px] rounded-full border border-dashed border-white/20"></div>
          <div className="absolute w-[1250px] h-[1250px] rounded-full border border-dashed border-white/10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
            انضم إلى آلاف المبدعين وابدأ بناء مساحتك <span className="text-mustard">اليوم</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-pistachio text-white px-10 py-4 rounded-xl font-semibold shadow-lg text-lg hover:opacity-90 transition-all w-full sm:w-auto pointer-events-auto">
              أنشئ مجتمعك مجاناً
            </button>
            <button className="border-2 border-mustard text-mustard px-10 py-4 rounded-xl font-semibold text-lg hover:bg-mustard hover:text-white transition-all w-full sm:w-auto pointer-events-auto">
              استكشف المجتمعات
            </button>
          </div>
        </div>

        <div className="hidden md:block absolute inset-0 pointer-events-none z-0 max-w-7xl mx-auto">
          <div className="absolute top-[6%] left-[22%] w-20 h-28 lg:w-24 lg:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform -rotate-6 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-2 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-[11px] lg:text-sm">أحمد زيد</h4>
              <p className="text-pistachio text-[9px] lg:text-[11px]">صانع محتوى</p>
            </div>
          </div>
          <div className="absolute bottom-[5%] right-[25%] w-20 h-28 lg:w-24 lg:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform -rotate-3 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-2 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-[11px] lg:text-sm">كريم يوسف</h4>
              <p className="text-mustard text-[9px] lg:text-[11px]">مصمم جرافيك</p>
            </div>
          </div>

          <div className="absolute bottom-[10%] left-[12%] w-24 h-32 lg:w-28 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-3 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-2.5 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-xs lg:text-sm">سارة أحمد</h4>
              <p className="text-pistachio text-[10px] lg:text-xs">مدربة حياة</p>
            </div>
          </div>
          <div className="absolute top-[8%] right-[15%] w-24 h-32 lg:w-28 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-6 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-2.5 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-xs lg:text-sm">عمر العتيبي</h4>
              <p className="text-mustard text-[10px] lg:text-xs">مطور ويب</p>
            </div>
          </div>

          <div className="absolute top-[40%] left-[4%] w-28 h-36 lg:w-32 lg:h-40 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform -rotate-2 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-3 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-sm lg:text-base">ليلى حسن</h4>
              <p className="text-pistachio text-[10px] lg:text-xs">رائدة أعمال</p>
            </div>
          </div>
          <div className="absolute top-[45%] right-[4%] w-28 h-36 lg:w-32 lg:h-40 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition-all duration-300 pointer-events-auto">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop" alt="Creator" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-3 inset-x-0 text-center">
              <h4 className="text-white font-heading font-bold text-sm lg:text-base">منى فريد</h4>
              <p className="text-mustard text-[10px] lg:text-xs">مستشارة أعمال</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-24 bg-off-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800">
              الأسئلة الشائعة
            </h2>
          </div>

          <div className="space-y-4" dir="rtl">
            {[
              {
                q: "هل المنصة تدعم اللغة العربية بالكامل؟",
                a: <>نعم، تم بناء <AnimatedLogo /> خصيصاً للمنطقة العربية. المنصة تدعم واجهة المستخدم من اليمين لليسار (RTL) بشكل أصلي وكامل في جميع الصفحات والميزات.</>
              },
              {
                q: "كيف يمكنني سحب أرباحي (في مصر والدول العربية)؟",
                a: "نحن ندعم التكامل مع بوابات الدفع المحلية والعالمية. يمكنك استقبال مدفوعاتك مباشرة وسحبها إلى حسابك البنكي المحلي أو محافظك الإلكترونية بكل سهولة وأمان."
              },
              {
                q: "هل أحتاج إلى خبرة برمجية لإنشاء مجتمعي؟",
                a: "إطلاقاً! المنصة تعمل بنظام (No-Code). يمكنك تخصيص ألوان مجتمعك، ورفع دوراتك، وإدارة المشتركين من خلال لوحة تحكم بسيطة وبضغطة زر."
              },
              {
                q: "هل أمتلك المحتوى والبيانات الخاصة بجمهوري؟",
                a: "بكل تأكيد. أنت المالك الوحيد لبيانات مجتمعك ومحتواك. نحن نوفر لك البنية التحتية فقط، ويمكنك تصدير بيانات المشتركين الخاصة بك في أي وقت."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between p-6 font-heading font-bold text-lg text-slate-800 select-none">
                  <span>{faq.q}</span>
                  <span className={`text-3xl font-normal transition-transform duration-300 ${openFaq === index ? 'text-mustard rotate-180' : 'text-pistachio'}`}>
                    {openFaq === index ? '−' : '+'}
                  </span>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="mx-6 pb-6 pt-2 font-body text-slate-600 leading-relaxed text-lg border-t border-slate-100">
                      {faq.a}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 pt-16 pb-8 rounded-t-[3rem]" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

            <div className="lg:col-span-2 space-y-6">
              <a href="#">
                <AnimatedLogo className="text-3xl" />
              </a>
              <p className="text-slate-400 font-body text-sm leading-relaxed max-w-xs mt-4">
                المقر الرقمي المتكامل لإدارة مجتمعات المبدعين في المنطقة العربية. ابنِ جمهورك، وقدم دوراتك، وحقق دخلاً مستداماً.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pistachio/20 hover:border-pistachio/50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-mustard/20 hover:border-mustard/50 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-white font-heading font-bold text-lg">المنصة</h4>
              <ul className="space-y-3 font-body text-sm text-slate-400">
                <li><a href="#" className="hover:text-pistachio transition-colors">المميزات</a></li>
                <li><a href="#" className="hover:text-pistachio transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-pistachio transition-colors">دراسات حالة</a></li>
                <li><a href="#" className="hover:text-pistachio transition-colors">تحديثات المنصة</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-white font-heading font-bold text-lg">الشركة</h4>
              <ul className="space-y-3 font-body text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">برنامج الشركاء</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-white font-heading font-bold text-lg">قانوني</h4>
              <ul className="space-y-3 font-body text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة الاسترجاع</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body text-slate-500">
            <div className="flex items-center gap-1">
              <span>© {new Date().getFullYear()}</span>
              <AnimatedLogo />
              <span>. جميع الحقوق محفوظة.</span>
            </div>
            <div className="flex items-center gap-2 bg-transparent py-2 px-5 rounded-full border border-slate-700 hover:border-slate-500 transition-colors cursor-default">
              <span>صُنع بحب في EG</span>
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}