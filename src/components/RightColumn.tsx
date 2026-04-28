import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUpload from "./ImageUpload";

gsap.registerPlugin(ScrollTrigger);

interface CVItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  year: string;
}

const fallbackCvData: Record<string, Omit<CVItem, 'id'>[]> = {
  fr: [
    { category: "Education", title: "Université de Stanford", subtitle: "Informatique / Master", year: "2018 - 2020" },
    { category: "Education", title: "Institut Indien de Technologie Delhi", subtitle: "Génie Électrique / Licence", year: "2014 - 2018" },
    { category: "Employment", title: "Conseiller produit indépendant", subtitle: "Stratégie IA & Technologie / Monde", year: "2022 - Présent" },
    { category: "Employment", title: "Google", subtitle: "Chef de produit / Plateforme ML", year: "2020 - 2022" },
    { category: "Employment", title: "McKinsey & Company", subtitle: "Analyste d'affaires / Pratique numérique", year: "2018 - 2020" },
    { category: "Investment", title: "Portefeuille technologique early-stage", subtitle: "Seed à Série A / IA & SaaS", year: "2021 - Présent" },
    { category: "Writing", title: "Lettre d'information sur la stratégie de l'IA", subtitle: "Substack / 50 000+ abonnés", year: "2023 - Présent" },
    { category: "Writing", title: "'La pensée commerciale à l'ère de l'IA'", subtitle: "Auto-publié / Bestseller Amazon", year: "2024" },
    { category: "Speaking", title: "Conférence TEDx", subtitle: "L'IA et l'avenir du travail humain", year: "2024" },
    { category: "Speaking", title: "Web Summit", subtitle: "Scène principale / Panel sur l'éthique de l'IA", year: "2023" },
    { category: "Featured", title: "Forbes 30 Under 30", subtitle: "Asie / Technologie & Finance", year: "2023" },
    { category: "Featured", title: "Bloomberg Businessweek", subtitle: "Nouvelles tendances dans l'investissement IA / Interview", year: "2024" },
    { category: "Featured", title: "TechCrunch", subtitle: "Guide de transformation IA pour startups", year: "2024" },
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
  const queryClient = useQueryClient();

  const { data: cvDataDb = [] } = useQuery({
    queryKey: ['cvEntries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cv_entries').select('*').order('sort_order');
      if (error) return [];
      return data;
    }
  });

  const createCv = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('cv_entries').insert([{
        category: vars.category,
        fr_title: vars.frTitle,
        fr_subtitle: vars.frSubtitle,
        en_title: vars.enTitle,
        en_subtitle: vars.enSubtitle,
        year: vars.year,
        sort_order: vars.sortOrder
      }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cvEntries'] }),
  });

  const updateCv = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('cv_entries').update({
        category: vars.category,
        fr_title: vars.frTitle,
        fr_subtitle: vars.frSubtitle,
        en_title: vars.enTitle,
        en_subtitle: vars.enSubtitle,
        year: vars.year
      }).eq('id', vars.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cvEntries'] }),
  });

  const deleteCv = useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase.from('cv_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cvEntries'] }),
  });


  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState({ category: "", frTitle: "", frSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
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
    ? dbItems.map((e: any) => ({
        category: e.category,
        title: language === "fr" ? e.fr_title : e.en_title,
        subtitle: language === "fr" ? (e.fr_subtitle || undefined) : (e.en_subtitle || undefined),
        year: e.year,
        id: e.id,
      }))
    : fallbackCvData[language].map((e, i) => ({ ...e, id: i.toString() }));

  const sections: Record<string, any[]> = {};
  items.forEach(item => {
    const cat = item.category;
    if (!sections[cat]) sections[cat] = [];
    sections[cat].push(item);
  });

  const sectionOrder = ["Education", "Employment", "Investment", "Writing", "Speaking", "Featured"];
  
  const categoryMap: Record<string, Record<string, string>> = {
    fr: {
      "Education": "Éducation",
      "Employment": "Emploi",
      "Investment": "Investissement",
      "Writing": "Écriture",
      "Speaking": "Conférences",
      "Featured": "Distinctions"
    },
    en: {
      "Education": "Education",
      "Employment": "Employment",
      "Investment": "Investment",
      "Writing": "Writing",
      "Speaking": "Speaking",
      "Featured": "Featured"
    }
  };

  const uiStrings = {
    fr: {
      add: "+ AJOUTER",
      edit: "MODIFIER",
      del: "SUPPR",
      save: "ENREGISTRER",
      cancel: "ANNULER",
      lastUpdated: "Dernière mise à jour",
      editAvatar: "MODIFIER L'AVATAR",
      close: "FERMER"
    },
    en: {
      add: "+ ADD",
      edit: "EDIT",
      del: "DEL",
      save: "SAVE",
      cancel: "CANCEL",
      lastUpdated: "Last Updated",
      editAvatar: "EDIT AVATAR",
      close: "CLOSE"
    }
  };

  const s = uiStrings[language];

  const startEdit = (item: (typeof items)[0]) => {
    const dbItem = dbItems.find((d: any) => d.id === item.id);
    if (dbItem) {
      setEditForm({
        category: dbItem.category,
        frTitle: dbItem.fr_title,
        frSubtitle: dbItem.fr_subtitle || "",
        enTitle: dbItem.en_title,
        enSubtitle: dbItem.en_subtitle || "",
        year: dbItem.year,
      });
      setEditingId(item.id);
      setIsAdding(false);
    }
  };

  const startAdd = () => {
    setEditForm({ category: "Education", frTitle: "", frSubtitle: "", enTitle: "", enSubtitle: "", year: "" });
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
              {s.add}
            </button>
          )}
        </div>

        <AvatarSection />

        {/* Edit form */}
        {(isAdding || editingId !== null) && (
          <div className="mb-6 p-3" style={{ border: "1px solid var(--border-light)", borderRadius: "2px" }}>
            <div className="space-y-2">
              {[
                { key: "category", ph: language === "fr" ? "Catégorie" : "Category" },
                { key: "frTitle", ph: language === "fr" ? "Titre (FR)" : "FR Title" },
                { key: "frSubtitle", ph: language === "fr" ? "Sous-titre (FR)" : "FR Subtitle" },
                { key: "enTitle", ph: language === "fr" ? "Titre (EN)" : "EN Title" },
                { key: "enSubtitle", ph: language === "fr" ? "Sous-titre (EN)" : "EN Subtitle" },
                { key: "year", ph: language === "fr" ? "Année" : "Year" },
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
              <button onClick={saveEdit} className="btn-filled text-[10px] px-3 py-1">{s.save}</button>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="btn-outline text-[10px] px-3 py-1">{s.cancel}</button>
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
                      {categoryMap[language][category]}
                    </span>
                  )}
                  {idx > 0 && <span style={{ width: "70px", flexShrink: 0 }} />}
                  <div className="flex-1 relative group">
                    <p style={{ fontSize: "11px", lineHeight: 1.6, color: "var(--text-charcoal)", whiteSpace: "pre-line" }}>{item.title}</p>
                    {item.subtitle && <p style={{ fontSize: "10px", lineHeight: 1.6, color: "var(--text-grey)", whiteSpace: "pre-line" }}>{item.subtitle}</p>}
                    <p style={{ fontSize: "10px", lineHeight: 1.6, color: "var(--text-grey)", marginTop: "2px" }}>{item.year}</p>
                    {isAdmin && useDb && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => startEdit(item)} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>{s.edit}</button>
                        <button onClick={() => { if (confirm(language === "fr" ? "Supprimer ?" : "Delete?")) deleteCv.mutate(item.id); }} style={{ fontSize: "9px", color: "#E74C3C", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>{s.del}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <p style={{ fontSize: "10px", color: "var(--text-grey)", marginTop: "32px", letterSpacing: "0.03em" }}>{s.lastUpdated} 2025.04</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar Section                                                    */
/* ------------------------------------------------------------------ */
function AvatarSection() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (error) return null;
      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('site_settings').update({
        avatar_image: vars.avatarImage
      }).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['siteSettings'] }),
  });


  const avatarUrl = settings?.avatar_image || "/images/portrait.jpg";

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
              <button onClick={() => setEditingAvatar(false)} className="btn-outline text-[10px] px-3 py-1 mt-2">{language === "fr" ? "FERMER" : "CLOSE"}</button>
            </div>
          ) : (
            <button onClick={() => setEditingAvatar(true)} style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>
              {language === "fr" ? "MODIFIER L'AVATAR" : "EDIT AVATAR"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
