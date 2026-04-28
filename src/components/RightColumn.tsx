import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { trpc } from "@/providers/trpc";
import ImageUpload from "./ImageUpload";

gsap.registerPlugin(ScrollTrigger);

interface CVItem {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
}

const fallbackCvData: Record<string, CVItem[]> = {
  zh: [
    { category: "Education", title: "斯坦福大学", subtitle: "计算机科学 / 硕士", year: "2018 - 2020" },
    { category: "Education", title: "印度理工学院德里分校", subtitle: "电子工程 / 学士", year: "2014 - 2018" },
    { category: "Employment", title: "独立产品顾问", subtitle: "AI 与科技战略 / 全球", year: "2022 - 至今" },
    { category: "Employment", title: "Google", subtitle: "产品经理 / 机器学习平台", year: "2020 - 2022" },
    { category: "Employment", title: "McKinsey & Company", subtitle: "商业分析师 / 数字实践", year: "2018 - 2020" },
    { category: "Investment", title: "早期科技投资组合", subtitle: "种子轮至A轮 / AI 与 SaaS", year: "2021 - 至今" },
    { category: "Writing", title: "AI 战略通讯", subtitle: "Substack / 50,000+ 订阅者", year: "2023 - 至今" },
    { category: "Writing", title: "《AI 时代的商业思维》", subtitle: "独立出版 / Amazon 畅销", year: "2024" },
    { category: "Speaking", title: "TEDx 演讲", subtitle: "AI 与人类未来的工作", year: "2024" },
    { category: "Speaking", title: "Web Summit", subtitle: "主舞台 / AI 伦理小组", year: "2023" },
    { category: "Featured", title: "福布斯 30 Under 30", subtitle: "亚洲 / 科技与金融", year: "2023" },
    { category: "Featured", title: "彭博商业周刊", subtitle: "AI 投资新趋势 / 专访", year: "2024" },
    { category: "Featured", title: "TechCrunch", subtitle: "创业公司AI转型指南", year: "2024" },
  ],
  en: [
    { category: "Education", title: "Stanford University", subtitle: "Computer Science / M.S.", year: "2018 - 2020" },
    { category: "Education", title: "IIT Delhi", subtitle: "Electrical Engineering / B.Tech", year: "2014 - 2018" },
    { category: "Employment", title: "Independent Product Advisor", subtitle: "AI & Technology Strategy / Global", year: "2022 - Present" },
    { category: "Employment", title: "Google", subtitle: "Product Manager / ML Platform", year: "2020 - 2022" },
    { category: "Employment", title: "McKinsey & Company", subtitle: "Business Analyst / Digital Practice", year: "2018 - 2020" },
    { category: "Investment", title: "Early-Stage Tech Portfolio", subtitle: "Seed to Series A / AI & SaaS", year: "2021 - Present" },
    { category: "Writing", title: "AI Strategy Newsletter", subtitle: "Substack / 50,000+ subscribers", year: "2023 - Present" },
    { category: "Writing", title: "'Business Thinking in the Age of AI'", subtitle: "Self-published / Amazon Bestseller", year: "2024" },
    { category: "Speaking", title: "TEDx Talk", subtitle: "AI & the Future of Human Work", year: "2024" },
    { category: "Speaking", title: "Web Summit", subtitle: "Main Stage / AI Ethics Panel", year: "2023" },
    { category: "Featured", title: "Forbes 30 Under 30", subtitle: "Asia / Technology & Finance", year: "2023" },
    { category: "Featured", title: "Bloomberg Businessweek", subtitle: "New Trends in AI Investing / Interview", year: "2024" },
    { category: "Featured", title: "TechCrunch", subtitle: "Startup Guide to AI Transformation", year: "2024" },
  ],
};

export default function RightColumn() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const { rightOpen, closeAll } = useSidebar();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: cvDataDb } = trpc.cv.list.useQuery();
  const createCv = trpc.cv.create.useMutation({ onSuccess: () => utils.cv.list.invalidate() });
  const updateCv = trpc.cv.update.useMutation({ onSuccess: () => utils.cv.list.invalidate() });
  const deleteCv = trpc.cv.delete.useMutation({ onSuccess: () => utils.cv.list.invalidate() });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: "", zhTitle: "", zhSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
  const [isAdding, setIsAdding] = useState(false);

  /* Animate panel open / close */
  useEffect(() => {
    if (!panelRef.current) return;
    if (rightOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, delay: 0.12, ease: "power2.out" }
        );
      }
    } else {
      gsap.to(panelRef.current, {
        x: 340,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [rightOpen]);

  // Transform DB entries to grouped format
  const dbItems = cvDataDb ?? [];
  const useDb = dbItems.length > 0;

  const items = useDb
    ? dbItems.map((e) => ({
        category: e.category,
        title: language === "zh" ? e.zhTitle : e.enTitle,
        subtitle: language === "zh" ? (e.zhSubtitle || undefined) : (e.enSubtitle || undefined),
        year: e.year,
        id: e.id,
      }))
    : fallbackCvData[language].map((e, i) => ({ ...e, id: i }));

  const sections = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sectionOrder = ["Education", "Employment", "Investment", "Writing", "Speaking", "Featured"];

  const startEdit = (item: (typeof items)[0]) => {
    const dbItem = dbItems.find((d) => d.id === item.id);
    if (dbItem) {
      setEditForm({
        category: dbItem.category,
        zhTitle: dbItem.zhTitle,
        zhSubtitle: dbItem.zhSubtitle || "",
        enTitle: dbItem.enTitle,
        enSubtitle: dbItem.enSubtitle || "",
        year: dbItem.year,
      });
      setEditingId(item.id);
      setIsAdding(false);
    }
  };

  const startAdd = () => {
    setEditForm({ category: "Education", zhTitle: "", zhSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
    setIsAdding(true);
    setEditingId(null);
  };

  const saveEdit = () => {
    if (isAdding) {
      createCv.mutate({ ...editForm, sortOrder: dbItems.length + 1 });
    } else if (editingId !== null) {
      updateCv.mutate({ id: editingId, ...editForm });
    }
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <aside
      ref={panelRef}
      className="fixed top-[44px] right-0 bottom-0 z-[36] overflow-hidden"
      style={{
        width: "320px",
        maxWidth: "90vw",
        transform: "translateX(340px)",
        willChange: "transform",
        backgroundColor: "var(--bg-warm-white)",
        borderLeft: "1px solid var(--border-light)",
      }}
    >
      <div ref={contentRef} className="h-full overflow-y-auto p-5 md:p-6 pb-24 sidebar-scroll">
        {/* Close button */}
        <button
          onClick={closeAll}
          className="absolute top-4 right-4 z-20 md:hidden"
          style={{ color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-grey)", lineHeight: 1.4 }}>
            CV / ARCHIVE
          </h2>
          {isAdmin && (
            <button onClick={startAdd} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>
              + ADD
            </button>
          )}
        </div>

        <AvatarSection />

        {/* Edit form */}
        {(isAdding || editingId !== null) && (
          <div className="mb-6 p-3" style={{ border: "1px solid var(--border-light)", borderRadius: "2px" }}>
            <div className="space-y-2">
              {[
                { key: "category", ph: "Category" },
                { key: "zhTitle", ph: "ZH Title" },
                { key: "zhSubtitle", ph: "ZH Subtitle" },
                { key: "enTitle", ph: "EN Title" },
                { key: "enSubtitle", ph: "EN Subtitle" },
                { key: "year", ph: "Year" },
              ].map((f) => (
                <input
                  key={f.key}
                  placeholder={f.ph}
                  value={editForm[f.key as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                  style={{
                    width: "100%",
                    fontSize: "11px",
                    padding: "6px 8px",
                    border: "1px solid var(--border-light)",
                    outline: "none",
                    background: "transparent",
                    color: "var(--text-charcoal)",
                    fontFamily: "'Space Mono', monospace",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={saveEdit} className="btn-filled text-[10px] px-3 py-1">SAVE</button>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="btn-outline text-[10px] px-3 py-1">CANCEL</button>
            </div>
          </div>
        )}

        {/* CV Sections */}
        {sectionOrder.map((category) => {
          const sectionItems = sections[category];
          if (!sectionItems || sectionItems.length === 0) return null;
          return (
            <div key={category} style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "14px", marginBottom: "14px" }}>
              {sectionItems.map((item, idx) => (
                <div key={item.id} className="flex gap-3" style={{ marginBottom: idx < sectionItems.length - 1 ? "14px" : "0" }}>
                  {idx === 0 && (
                    <span style={{ fontSize: "10px", fontWeight: 400, color: "var(--text-grey)", lineHeight: 1.6, flexShrink: 0, width: "70px", letterSpacing: "0.03em" }}>
                      {category}
                    </span>
                  )}
                  {idx > 0 && <span style={{ width: "70px", flexShrink: 0 }} />}
                  <div className="flex-1 relative group">
                    <p style={{ fontSize: "11px", lineHeight: 1.6, color: "var(--text-charcoal)", whiteSpace: "pre-line" }}>{item.title}</p>
                    {item.subtitle && <p style={{ fontSize: "10px", lineHeight: 1.6, color: "var(--text-grey)", whiteSpace: "pre-line" }}>{item.subtitle}</p>}
                    <p style={{ fontSize: "10px", lineHeight: 1.6, color: "var(--text-grey)", marginTop: "2px" }}>{item.year}</p>
                    {isAdmin && useDb && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => startEdit(item)} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>EDIT</button>
                        <button onClick={() => { if (confirm("Delete?")) deleteCv.mutate({ id: item.id }); }} style={{ fontSize: "9px", color: "#E74C3C", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>DEL</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <p style={{ fontSize: "10px", color: "var(--text-grey)", marginTop: "32px", letterSpacing: "0.03em" }}>Last Updated 2025.04</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar Section                                                    */
/* ------------------------------------------------------------------ */
function AvatarSection() {
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const { data: settings } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => utils.settings.get.invalidate(),
  });

  const avatarUrl = settings?.avatarImage || "/images/portrait.jpg";

  useEffect(() => {
    if (!frameRef.current || !imageRef.current) return;
    const tween = gsap.to(imageRef.current, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: frameRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [avatarUrl]);

  return (
    <div className="mb-8">
      <div
        ref={frameRef}
        className="overflow-hidden"
        style={{ border: "1px solid var(--border-light)", boxShadow: "0px 2px 10px rgba(0,0,0,0.06)", aspectRatio: "1 / 1", width: "100%", borderRadius: "2px" }}
      >
        <img ref={imageRef} src={avatarUrl} alt="Portrait" className="block" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
      </div>
      {isAdmin && (
        <div className="mt-2">
          {editingAvatar ? (
            <div className="p-2" style={{ border: "1px solid var(--border-light)", borderRadius: "2px" }}>
              <ImageUpload value={avatarUrl} onChange={(url) => updateSettings.mutate({ avatarImage: url })} label="Avatar" variant="light" />
              <button onClick={() => setEditingAvatar(false)} className="btn-outline text-[10px] px-3 py-1 mt-2">CLOSE</button>
            </div>
          ) : (
            <button onClick={() => setEditingAvatar(true)} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>
              EDIT AVATAR
            </button>
          )}
        </div>
      )}
    </div>
  );
}
