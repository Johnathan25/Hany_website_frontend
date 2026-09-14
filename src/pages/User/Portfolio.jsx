import React, { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  MapPin,
  X,
  Search,
  Building2,
  Play,
  Video,
  Wrench,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|&v=)([^#&?]+)/
  );
  return match && match[1] ? match[1] : null;
};

const getYouTubeThumbnail = (url) => {
  const id = getYouTubeVideoId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
};

const getYouTubeEmbedUrl = (url) => {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
};

const PORTFOLIO_PROJECTS = [
  {
    _id: "p1",
    titleAr: "صيانة وإصلاح طلمبات إطفاء الحريق (كهرباء وديزل)",
    titleEn: "Maintenance & Repair of Fire Fighting Pumps (Electric & Diesel)",
    category: "fire_safety",
    categoryAr: "أنظمة مكافحة الحريق",
    categoryEn: "Fire Fighting Systems",
    locationAr: "موقع المشروع",
    locationEn: "Project Site",
    youtubeVideoUrl: "https://youtube.com/shorts/DAjb_V_RT_I?si=8Woapplzsb78JKGe",
    descriptionAr:
      "أعمال الفحص الشامل والصيانة الوقائية لطلمبات الحريق الديزل والكهربائية، وضبط لوحات التحكم الآلية لضمان الجاهزية الفورية في حالات الطوارئ.",
    descriptionEn:
      "Complete overhaul, maintenance, and automated control panel calibration for electric and diesel fire fighting pumps.",
  },
  {
    _id: "p2",
    titleAr: "ربط مولدات الديزل على التوازي (سنكرونايزيشن)",
    titleEn: "Diesel Generator Synchronization & Parallel Grid Tie",
    category: "electrical",
    categoryAr: "أنظمة طوارئ ومولدات",
    categoryEn: "Generators & Power",
    locationAr: "موقع هندسي",
    locationEn: "Engineering Site",
    youtubeVideoUrl: "https://youtu.be/eoGRb4wZehw?si=7K5fTA-PdR72TTxh",
    descriptionAr:
      "تصميم وتنفيذ دوائر ربط المولدات على التوازي (Synchronization) وتوزيع الأحمال آلياً لضمان استقرار الشبكة وعدم انقطاع التيار.",
    descriptionEn:
      "Design, configuration, and commissioning of generator synchronization systems for parallel load sharing.",
  },
  {
    _id: "p3",
    titleAr: "تشطيب شقة بالكامل - الزمالك",
    titleEn: "Full Apartment Finishing - Zamalek",
    category: "finishing",
    categoryAr: "تشطيبات وديكور",
    categoryEn: "Interior Finishing",
    locationAr: "الزمالك، القاهرة",
    locationEn: "Zamalek, Cairo",
    youtubeVideoUrl: "https://youtube.com/shorts/tRB9Agn10jk?si=LPc30yFufed5yef5",
    descriptionAr:
      "تنفيذ أعمال التشطيبات المعمارية الراقية لشقة سكنية بالزمالك وفق أحدث التصاميم المودرن مع الاهتمام بأدق التفاصيل الهندسية.",
    descriptionEn:
      "Turnkey interior finishing and architectural modern decoration execution for an upscale apartment in Zamalek.",
  },
  {
    _id: "p5",
    titleAr: "تشطيب ريسبشن مع مطبخ أمريكاني مفتوح",
    titleEn: "Reception & Open American Kitchen Finishing",
    category: "finishing",
    categoryAr: "تشطيبات وديكور",
    categoryEn: "Interior Finishing",
    locationAr: "الزمالك، القاهرة",
    locationEn: "Zamalek, Cairo",
    youtubeVideoUrl: "https://youtube.com/shorts/6apIy-GFR-o?si=zHKVRF3jg2le5tyf",
    descriptionAr:
      "تصميم وتنفيذ منطقة ريسبشن مفتوحة مع مطبخ أمريكاني فاخر وتناسق إضاءات الليد المخفية وأعمال الجبس بورد الحديثة.",
    descriptionEn:
      "Integrated reception renovation with custom open American kitchen, ambient architectural LED lighting, and modern gypsum works.",
  },
  {
    _id: "p6",
    titleAr: "باب خشب بالمرايا جرار بميكانيزم مخفي",
    titleEn: "Sliding Wooden Door with Mirrors & Hidden Mechanism",
    category: "finishing",
    categoryAr: "تشطيبات وديكور",
    categoryEn: "Interior Finishing",
    locationAr: "الزمالك",
    locationEn: "Zamalek",
    youtubeVideoUrl: "https://youtube.com/shorts/7GcuOodvqxA?si=KIzJU_SJZPb1pqAb",
    descriptionAr:
      "تصنيع وتركيب باب خشب بتكسية مرايا كاملة بنظام جرار مخفي يعطي اتساعاً للمكان ومظهراً ديكورياً فاخراً.",
    descriptionEn:
      "Custom mirrored sliding door with high-durability concealed sliding track system for optimized aesthetic appeal and space.",
  },
  {
    _id: "p7",
    titleAr: "تشطيب شقة دوبلكس - التجمع الخامس",
    titleEn: "Duplex Apartment Finishing - Fifth Settlement",
    category: "finishing",
    categoryAr: "تشطيبات وديكور",
    categoryEn: "Interior Finishing",
    locationAr: "التجمع الخامس، القاهرة الجديدة",
    locationEn: "Fifth Settlement, New Cairo",
    youtubeVideoUrl: "https://youtu.be/5oDGUgCvByU?si=x3aU90T63AwDPubA",
    descriptionAr:
      "تنفيذ أعمال تشطيب وتأسيس متكاملة لشقة دوبلكس بالتجمع الخامس شملت الأرضيات الفاخرة، والسباكة، والكهرباء، والدهانات.",
    descriptionEn:
      "Comprehensive luxury finishing and MEP implementation for a high-end duplex apartment in the Fifth Settlement.",
  },
  {
    _id: "p8",
    titleAr: "أعمال تنفيذ وتشطيبات داخلية ومعمارية متطورة",
    titleEn: "Advanced Interior Architecture & Decoration Project",
    category: "finishing",
    categoryAr: "تشطيبات وديكور",
    categoryEn: "Interior Finishing",
    locationAr: "موقع العمل",
    locationEn: "On-Site Work",
    youtubeVideoUrl: "https://youtube.com/shorts/CAua3rnFZvY?si=i-xuWhjlTH3sPHO_",
    descriptionAr:
      "توثيق ميداني لمراحل التنفيذ الفعلي والتشطيبات المعمارية الدقيقة واستعراض جودة الخامات وآليات التركيب الحديثة.",
    descriptionEn:
      "Field documentation demonstrating advanced interior craftsmanship, materials installation, and finishing details.",
  },
  {
    _id: "p9",
    titleAr: "تنفيذ حلول هندسية وتجهيزات كهروميكانيكية متخصصة",
    titleEn: "Specialized Electromechanical & Engineering Works",
    category: "electrical",
    categoryAr: "أنظمة طوارئ ومولدات",
    categoryEn: "Generators & Power",
    locationAr: "موقع المشروع",
    locationEn: "Project Site",
    youtubeVideoUrl: "https://youtube.com/shorts/pTZ4Wvj4JYs?si=nGwbrmfZRub9-EX9",
    descriptionAr:
      "تطبيق هندسي ميداني يتضمن أعمال التركيبات والتوصيلات الكهروميكانيكية المتخصصة لضمان أعلى كفاءة تشغيلية وأمان.",
    descriptionEn:
      "On-site electromechanical solutions and engineering execution ensuring superior operational performance and safety standards.",
  },
];

export default function Portfolio() {
  const { isAr } = useLanguage();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState(null);

  const categories = [
    { key: "all", labelAr: "جميع الأعمال", labelEn: "All Works" },
    { key: "finishing", labelAr: "تشطيبات وديكور", labelEn: "Finishing" },
    { key: "electrical", labelAr: "طاقة ومولدات", labelEn: "Generators" },
    { key: "fire_safety", labelAr: "أنظمة حريق", labelEn: "Fire Safety" },
  ];

  const staggeredOffsets = [
    "lg:translate-y-0",
    "lg:translate-y-10",
    "lg:translate-y-20",
  ];

  const filteredProjects = useMemo(() => {
    return PORTFOLIO_PROJECTS.filter((project) => {
      const matchCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const title = isAr ? project.titleAr : project.titleEn;
      const matchSearch =
        !search.trim() ||
        title?.toLowerCase().includes(search.trim().toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search, isAr]);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 pt-12 sm:pt-16 font-sans overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 space-y-12">
        {/* Page Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "سجل الإنجاز والتنفيذ" : "Portfolio & Field Work"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? "معرض الأعمال والمشاريع" : "Our Projects Gallery"}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {isAr
              ? "توثيق حي لأحدث مشاريعنا المنجزة في أعمال التشطيبات الراقية، التجهيزات الكهروميكانيكية، وصيانة شبكات إطفاء الحريق."
              : "Field documentation of executed luxury interior designs, MEP setups, and specialized firefighting infrastructure."}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 rtl:right-3.5 ltr:left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? "ابحث عن مشروع..." : "Search projects..."}
              className="w-full rtl:pr-10 ltr:pl-10 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Staggered Ladder Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-md mx-auto">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">
              {isAr ? "لا توجد نتائج مطابقة" : "No projects match your filter"}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-28 lg:pb-36 items-start">
            {filteredProjects.map((project, index) => {
              const title = isAr ? project.titleAr : project.titleEn;
              const desc = isAr ? project.descriptionAr : project.descriptionEn;
              const location = isAr ? project.locationAr : project.locationEn;
              const categoryName = isAr ? project.categoryAr : project.categoryEn;
              const thumbnailUrl = getYouTubeThumbnail(project.youtubeVideoUrl);

              return (
                <div
                  key={project._id}
                  className={`group relative flex flex-col transition-all duration-500 ease-out 
                  `}
                >
                  {/* Cover Image */}
                  <div
                    onClick={() => setActiveProject(project)}
                    className="relative w-full h-64 sm:h-72 lg:h-80 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={thumbnailUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-4 rtl:right-4 ltr:left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-xs">
                        <Wrench className="w-3 h-3 text-blue-400" />
                        <span>{categoryName}</span>
                      </span>
                    </div>

                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:bg-red-600 group-hover:scale-115 transition-all">
                        <Play className="w-5 h-5 fill-white rtl:translate-x-0.5 ltr:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Floating Info Card */}
                  <div className="relative -mt-16 sm:-mt-20 mx-4 sm:mx-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 group-hover:border-blue-500/40 group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5 text-start">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{location}</span>
                      </div>

                      <h3
                        onClick={() => setActiveProject(project)}
                        className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 cursor-pointer"
                      >
                        {title}
                      </h3>

                      <div className="w-full h-0.5 bg-blue-500 to-transparent rounded-full" />

                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {desc}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      

                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        className="inline-flex items-center gap-1.5 py-2.5 px-4 sm:px-5 bg-slate-900 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer group-hover:shadow-md active:scale-95"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{isAr ? "مشاهدة الفيديو" : "Watch Video"}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[94vh] flex flex-col">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 block">
                  {isAr ? activeProject.categoryAr : activeProject.categoryEn}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                  {isAr ? activeProject.titleAr : activeProject.titleEn}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                <iframe
                  src={getYouTubeEmbedUrl(activeProject.youtubeVideoUrl)}
                  title={isAr ? activeProject.titleAr : activeProject.titleEn}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{isAr ? activeProject.locationAr : activeProject.locationEn}</span>
              </div>

              <div className="space-y-1.5 text-start">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isAr ? "تفاصيل تنفيذ المشروع" : "Project Execution Details"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {isAr ? activeProject.descriptionAr : activeProject.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/70">
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {isAr ? "إغلاق النافذة" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}