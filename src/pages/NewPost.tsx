import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUpload from "@/components/ImageUpload";

export default function NewPost() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    year: "2024",
    image: "/images/hero-art.jpg",
    frTitle: "", frSubtitle: "", frCollection: "", frContent: "", frDetailContent: "",
    enTitle: "", enSubtitle: "", enCollection: "", enContent: "", enDetailContent: "",
  });

  const createPost = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('posts').insert([{
        year: vars.year,
        image: vars.image,
        sort_order: vars.sortOrder,
        fr_title: vars.frTitle,
        fr_subtitle: vars.frSubtitle,
        fr_collection: vars.frCollection,
        fr_content: vars.frContent,
        fr_detail_content: vars.frDetailContent,
        en_title: vars.enTitle,
        en_subtitle: vars.enSubtitle,
        en_collection: vars.enCollection,
        en_content: vars.enContent,
        en_detail_content: vars.enDetailContent
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-v3'] });
      navigate("/");
    },
  });


  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleSubmit = () => {
    if (!form.frTitle || !form.enTitle) return;
    createPost.mutate({ ...form, sortOrder: 0 });
  };

  const t = {
    fr: { title: "Nouvel article", back: "RETOUR", submit: "PUBLIER", submitting: "Publication...", required: "Le titre est obligatoire" },
    en: { title: "New Post", back: "Back", submit: "Publish", submitting: "Publishing...", required: "Title is required" },
  };
  const s = t[language === "fr" ? "fr" : "en"];

  const inputStyle = {
    width: "100%",
    fontSize: "12px",
    padding: "8px 10px",
    border: "1px solid var(--border-light)",
    outline: "none",
    color: "var(--text-charcoal)",
    fontFamily: "'Space Mono', monospace",
    background: "transparent",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6" style={{ height: "40px", zIndex: 50, backgroundColor: "var(--bg-warm-white)", borderBottom: "1px solid var(--border-light)" }}>
        <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
          NEURAL ATELIER (BLOG)
        </button>
        <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
          {s.back}
        </button>
      </header>

      {/* Form */}
      <div className="mx-auto" style={{ maxWidth: "680px", padding: "80px 24px 80px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 400, color: "var(--text-charcoal)", marginBottom: "32px" }}>{s.title}</h1>

        <div className="space-y-4">
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-grey)", display: "block", marginBottom: "4px" }}>{language === "fr" ? "Année" : "Year"}</label>
            <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle} />
          </div>

          <div>
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Image"
              variant="dark"
            />
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
            <h3 style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "12px" }}>{language === "fr" ? "Contenu Français" : "French Content"}</h3>
            <div className="space-y-3">
              <input placeholder="Titre" value={form.frTitle} onChange={(e) => setForm({ ...form, frTitle: e.target.value })} style={inputStyle} />
              <input placeholder="Sous-titre" value={form.frSubtitle} onChange={(e) => setForm({ ...form, frSubtitle: e.target.value })} style={inputStyle} />
              <input placeholder="Collection" value={form.frCollection} onChange={(e) => setForm({ ...form, frCollection: e.target.value })} style={inputStyle} />
              <textarea placeholder="Résumé" value={form.frContent} onChange={(e) => setForm({ ...form, frContent: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <textarea placeholder="Détail du contenu" value={form.frDetailContent} onChange={(e) => setForm({ ...form, frDetailContent: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
            <h3 style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "12px" }}>{language === "fr" ? "Contenu Anglais" : "English Content"}</h3>
            <div className="space-y-3">
              <input placeholder={language === "fr" ? "Titre" : "Title"} value={form.enTitle} onChange={(e) => setForm({ ...form, enTitle: e.target.value })} style={inputStyle} />
              <input placeholder={language === "fr" ? "Sous-titre" : "Subtitle"} value={form.enSubtitle} onChange={(e) => setForm({ ...form, enSubtitle: e.target.value })} style={inputStyle} />
              <input placeholder={language === "fr" ? "Collection" : "Collection"} value={form.enCollection} onChange={(e) => setForm({ ...form, enCollection: e.target.value })} style={inputStyle} />
              <textarea placeholder={language === "fr" ? "Résumé" : "Summary content"} value={form.enContent} onChange={(e) => setForm({ ...form, enContent: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <textarea placeholder={language === "fr" ? "Contenu détaillé" : "Detail content"} value={form.enDetailContent} onChange={(e) => setForm({ ...form, enDetailContent: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={createPost.isPending}
            style={{
              width: "100%", padding: "12px", fontSize: "12px", fontFamily: "'Space Mono', monospace",
              color: "var(--bg-warm-white)", background: "var(--text-charcoal)", border: "none",
              cursor: createPost.isPending ? "wait" : "pointer", opacity: createPost.isPending ? 0.7 : 1,
              letterSpacing: "0.05em", marginTop: "16px",
            }}
          >
            {createPost.isPending ? s.submitting : s.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
