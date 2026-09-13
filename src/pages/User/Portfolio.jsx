import React, { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Briefcase,
  Layers,
  MapPin,
  X,
  Search,
  Building2,
  Play,
  Video,
  Wrench,
} from "lucide-react";

// Helper function to extract YouTube video ID from standard or shorts URLs
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|&v=)([^#&?]+)/
  );
  return match && match[1] ? match[1] : null;
};

// Helper function to generate YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  const id = getYouTubeVideoId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
};

// Helper function to convert any YouTube URL (including Shorts) to embed URL
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
    youtubeVideoUrl: "https://youtube.com/shorts/7GcuOodvqxA?si=KIzJU_SJZPb1pqAb",
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
    youtubeVideoUrl: "https://youtu.be/eoGRb4wZehw?si=7K5fTA-PdR72TTxh",
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
  // الرابط الجديد الأول
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
  // الرابط الجديد الثاني
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState(null);

  const categories = [
    { key: "all", labelAr: "جميع الأعمال", labelEn: "All Works" },
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
      className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
         
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isAr ? "سجل المشاريع والتنفيذ" : "Projects & Execution Records"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isAr
              ? "استعرض توثيقاً بالفيديو لأحدث مشاريعنا في أعمال التشطيبات المعمارية، وربط المولدات، وصيانة أنظمة إطفاء الحريق."
              : "Watch real project demonstrations covering architectural interior finishing, generator synchronization, and fire pump maintenance."}
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
                    ? "bg-slate-900 text-white -xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 rtl:right-3.5 ltr:left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? "ابحث عن مشروع..." : "Search project..."}
              className="w-full rtl:pr-10 ltr:pl-10 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-md mx-auto">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">
              {isAr ? "لا توجد نتائج مطابقة" : "No projects match your filter"}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const title = isAr ? project.titleAr : project.titleEn;
              const desc = isAr ? project.descriptionAr : project.descriptionEn;
              const location = isAr ? project.locationAr : project.locationEn;
              const thumbnailUrl = getYouTubeThumbnail(project.youtubeVideoUrl);

              return (
                <div
                  key={project._id}
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl overflow-hidden -xs hover:-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Video Thumbnail with YouTube Play Overlay */}
                    <div
                      className="relative h-52 w-full overflow-hidden bg-slate-900 cursor-pointer"
                      onClick={() => setActiveProject(project)}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-13 h-13 rounded-full bg-red-600/90 text-white flex items-center justify-center -xl group-hover:bg-red-600 group-hover:scale-115 transition-all">
                          <Play className="w-5 h-5 fill-white rtl:translate-x-0.5 ltr:translate-x-0.5" />
                        </div>
                      </div>

                    
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <h3
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                        onClick={() => setActiveProject(project)}
                      >
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{location}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          {isAr ? "تنفيذ معتمد" : "Verified Work"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button to open Modal Player */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-red-600 text-slate-700 hover:text-white border border-slate-200 hover:border-red-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>{isAr ? "مشاهدة الفيديو الميداني" : "Watch Field Video"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal with Embedded YouTube iFrame */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden -2xl border border-slate-100 max-h-[94vh] flex flex-col">
            {/* Modal Header */}
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

            {/* Modal Body: Embedded Player */}
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black -lg">
                <iframe
                  src={getYouTubeEmbedUrl(activeProject.youtubeVideoUrl)}
                  title={isAr ? activeProject.titleAr : activeProject.titleEn}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Location Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{isAr ? activeProject.locationAr : activeProject.locationEn}</span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isAr ? "تفاصيل تنفيذ المشروع" : "Project Execution Details"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {isAr ? activeProject.descriptionAr : activeProject.descriptionEn}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
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