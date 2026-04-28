import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/providers/trpc";
import ImageUpload from "@/components/ImageUpload";

export default function NewPost() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    year: "2024",
    image: "/images/hero-art.jpg",
    zhTitle: "", zhSubtitle: "", zhCollection: "", zhContent: "", zhDetailContent: "",
    enTitle: "", enSubtitle: "", enCollection: "", enContent: "", enDetailContent: "",
  });

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      navigate("/");
    },
  });

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleSubmit = () => {
    if (!form.zhTitle || !form.enTitle) return;
    createPost.mutate({ ...form, sortOrder: 0 });
  };

  const t = {
    zh: { title: "新建文章", back: "返回", submit: "发布", submitting: "发布中...", required: "标题为必填项" },
    en: { title: "New Post", back: "Back", submit: "Publish", submitting: "Publishing...", required: "Title is required" },
  };
  const s = t[language === "zh" ? "zh" : "en"];

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
            <label style={{ fontSize: "11px", color: "var(--text-grey)", display: "block", marginBottom: "4px" }}>Year</label>
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
            <h3 style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "12px" }}>中文内容</h3>
            <div className="space-y-3">
              <input placeholder="标题" value={form.zhTitle} onChange={(e) => setForm({ ...form, zhTitle: e.target.value })} style={inputStyle} />
              <input placeholder="副标题" value={form.zhSubtitle} onChange={(e) => setForm({ ...form, zhSubtitle: e.target.value })} style={inputStyle} />
              <input placeholder="分类" value={form.zhCollection} onChange={(e) => setForm({ ...form, zhCollection: e.target.value })} style={inputStyle} />
              <textarea placeholder="摘要内容" value={form.zhContent} onChange={(e) => setForm({ ...form, zhContent: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <textarea placeholder="详细内容" value={form.zhDetailContent} onChange={(e) => setForm({ ...form, zhDetailContent: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
            <h3 style={{ fontSize: "12px", color: "var(--text-grey)", marginBottom: "12px" }}>English Content</h3>
            <div className="space-y-3">
              <input placeholder="Title" value={form.enTitle} onChange={(e) => setForm({ ...form, enTitle: e.target.value })} style={inputStyle} />
              <input placeholder="Subtitle" value={form.enSubtitle} onChange={(e) => setForm({ ...form, enSubtitle: e.target.value })} style={inputStyle} />
              <input placeholder="Collection" value={form.enCollection} onChange={(e) => setForm({ ...form, enCollection: e.target.value })} style={inputStyle} />
              <textarea placeholder="Summary content" value={form.enContent} onChange={(e) => setForm({ ...form, enContent: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              <textarea placeholder="Detail content" value={form.enDetailContent} onChange={(e) => setForm({ ...form, enDetailContent: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
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
