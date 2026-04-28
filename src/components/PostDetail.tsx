import { useParams, useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogPost } from "../../contracts/blog";
import ImageUpload from "./ImageUpload";

interface PostDetailProps {
  posts: BlogPost[];
}

export default function PostDetail({ posts }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const isEditMode = searchParams.get("mode") === "edit" && isAdmin;

  const post = posts.find((p) => String(p.id) === String(id));

  const updatePost = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('posts').update({
        year: vars.year,
        image: vars.image,
        zh_title: vars.zhTitle,
        zh_subtitle: vars.zhSubtitle,
        zh_collection: vars.zhCollection,
        zh_content: vars.zhContent,
        zh_detail_content: vars.zhDetailContent,
        en_title: vars.enTitle,
        en_subtitle: vars.enSubtitle,
        en_collection: vars.enCollection,
        en_content: vars.enContent,
        en_detail_content: vars.enDetailContent
      }).eq('id', vars.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts-v2'] });
      navigate(`/post/${id}`);
    },
  });

  const [editForm, setEditForm] = useState({
    year: "", image: "", zhTitle: "", zhSubtitle: "", zhCollection: "",
    zhContent: "", zhDetailContent: "", enTitle: "", enSubtitle: "",
    enCollection: "", enContent: "", enDetailContent: "",
  });

  useEffect(() => {
    if (post && isEditMode) {
      setEditForm({
        year: post.year, image: post.image, zhTitle: post.zh.title,
        zhSubtitle: post.zh.subtitle, zhCollection: post.zh.collection,
        zhContent: post.zh.content, zhDetailContent: post.zh.detailContent,
        enTitle: post.en.title, enSubtitle: post.en.subtitle,
        enCollection: post.en.collection, enContent: post.en.content,
        enDetailContent: post.en.detailContent,
      });
    }
  }, [post, isEditMode]);

  useEffect(() => {
    if (contentRef.current && !isEditMode) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
    }
    if (imageRef.current && !isEditMode) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [id, isEditMode]);

  const backText = language === "zh" ? "返回首页" : "Back to home";
  const notFoundText = language === "zh" ? "文章不存在" : "Article not found";
  const editThisText = language === "zh" ? "编辑此文章" : "Edit this post";
  const viewText = language === "zh" ? "查看文章" : "View article";

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "#2A2A2A",
    border: "1px solid #444",
    borderRadius: "2px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#FFFFFF",
    fontFamily: "'Space Mono', monospace",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.5)",
    display: "block",
    marginBottom: "6px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
        <div className="text-center">
          <p style={{ fontSize: "14px", color: "var(--text-grey)" }}>{notFoundText}</p>
          <button onClick={() => navigate("/")} className="mt-4 underline-btn">
            {backText}
          </button>
        </div>
      </div>
    );
  }

  // EDIT MODE
  if (isEditMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1A1A1A" }}>
        <header
          className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 md:px-6"
          style={{ height: "44px", zIndex: 50, backgroundColor: "#1A1A1A", borderBottom: "1px solid #333" }}
        >
          <button onClick={() => navigate("/")} style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}>
            KHUSHAANK GUPTA
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/post/${post.id}`)} style={{ fontSize: "11px", fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}>
              {viewText}
            </button>
            <button onClick={() => navigate("/")} style={{ fontSize: "11px", fontFamily: "'Space Mono', monospace", color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}>
              {language === "zh" ? "关闭" : "Close"}
            </button>
          </div>
        </header>

        <div className="mx-auto px-4 md:px-6" style={{ maxWidth: "720px", padding: "72px 0 80px" }}>
          <h1 style={{ fontSize: "15px", fontWeight: 400, color: "#FFFFFF", letterSpacing: "0.05em", marginBottom: "32px" }}>{editThisText}</h1>

          <div className="space-y-5">
            <div>
              <label style={labelStyle}>Year</label>
              <input type="text" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} style={inputBase} />
            </div>

            <div>
              <ImageUpload value={editForm.image} onChange={(url) => setEditForm({ ...editForm, image: url })} label="Image" />
            </div>

            <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", letterSpacing: "0.05em", fontFamily: "'Space Mono', monospace" }}>中文内容</h3>
              <div className="space-y-4">
                <div><label style={labelStyle}>标题</label><input type="text" value={editForm.zhTitle} onChange={(e) => setEditForm({ ...editForm, zhTitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>副标题</label><input type="text" value={editForm.zhSubtitle} onChange={(e) => setEditForm({ ...editForm, zhSubtitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>分类</label><input type="text" value={editForm.zhCollection} onChange={(e) => setEditForm({ ...editForm, zhCollection: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>摘要</label><textarea value={editForm.zhContent} onChange={(e) => setEditForm({ ...editForm, zhContent: e.target.value })} rows={3} style={{ ...inputBase, resize: "vertical" }} /></div>
                <div><label style={labelStyle}>详细内容</label><textarea value={editForm.zhDetailContent} onChange={(e) => setEditForm({ ...editForm, zhDetailContent: e.target.value })} rows={8} style={{ ...inputBase, resize: "vertical" }} /></div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", letterSpacing: "0.05em", fontFamily: "'Space Mono', monospace" }}>English Content</h3>
              <div className="space-y-4">
                <div><label style={labelStyle}>Title</label><input type="text" value={editForm.enTitle} onChange={(e) => setEditForm({ ...editForm, enTitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Subtitle</label><input type="text" value={editForm.enSubtitle} onChange={(e) => setEditForm({ ...editForm, enSubtitle: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Collection</label><input type="text" value={editForm.enCollection} onChange={(e) => setEditForm({ ...editForm, enCollection: e.target.value })} style={inputBase} /></div>
                <div><label style={labelStyle}>Summary</label><textarea value={editForm.enContent} onChange={(e) => setEditForm({ ...editForm, enContent: e.target.value })} rows={3} style={{ ...inputBase, resize: "vertical" }} /></div>
                <div><label style={labelStyle}>Detail Content</label><textarea value={editForm.enDetailContent} onChange={(e) => setEditForm({ ...editForm, enDetailContent: e.target.value })} rows={8} style={{ ...inputBase, resize: "vertical" }} /></div>
              </div>
            </div>

            <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid #333" }}>
              <button
                onClick={() => updatePost.mutate({ id: post.id, ...editForm, sortOrder: post.id })}
                disabled={updatePost.isPending}
                className="btn-filled flex-1 py-3 text-[11px]"
                style={{ opacity: updatePost.isPending ? 0.6 : 1, cursor: updatePost.isPending ? "wait" : "pointer" }}
              >
                {updatePost.isPending ? (language === "zh" ? "保存中..." : "Saving...") : (language === "zh" ? "保存" : "SAVE")}
              </button>
              <button onClick={() => navigate(`/post/${post.id}`)} className="btn-dark flex-1 py-3 text-[11px]">
                {language === "zh" ? "取消" : "CANCEL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  const content = post[language];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 md:px-6"
        style={{ height: "44px", zIndex: 50, backgroundColor: "var(--bg-warm-white)", borderBottom: "1px solid var(--border-light)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <button onClick={() => navigate("/")} style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
          KHUSHAANK GUPTA
        </button>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button onClick={() => navigate(`/post/${post.id}?mode=edit`)} style={{ fontSize: "10px", fontFamily: "'Space Mono', monospace", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em" }}>
              EDIT
            </button>
          )}
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
            {language === "zh" ? "关闭" : "Close"}
          </button>
        </div>
      </header>

      <div ref={contentRef} className="mx-auto px-4 md:px-6" style={{ maxWidth: "700px", padding: "72px 0 80px" }}>
        {/* Meta */}
        <div className="flex items-center gap-2 mb-5">
          <span style={{ fontSize: "10px", color: "var(--text-grey)", letterSpacing: "0.05em" }}>{post.year}</span>
          <span style={{ fontSize: "10px", color: "var(--border-light)" }}>/</span>
          <span className="uppercase" style={{ fontSize: "10px", color: "var(--accent-teal)", letterSpacing: "0.06em" }}>{content.collection}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 400, lineHeight: 1.25, color: "var(--text-charcoal)", marginBottom: "6px" }}>
          {content.title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-grey)", lineHeight: 1.5, marginBottom: "28px" }}>{content.subtitle}</p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border-light)", marginBottom: "28px" }} />

        {/* Featured Image */}
        <div ref={imageRef} className="mb-8 overflow-hidden" style={{ border: "1px solid var(--border-light)", borderRadius: "2px" }}>
          <img src={post.image} alt={content.title} className="w-full h-auto block" style={{ aspectRatio: "16/9", objectFit: "cover" }} loading="eager" />
        </div>

        {/* Content */}
        <div 
          className="article-content"
          style={{ fontSize: "13px", lineHeight: 1.85, color: "var(--text-charcoal)" }}
          dangerouslySetInnerHTML={{ __html: content.detailContent }}
        />

        {/* Back link */}
        <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "48px", paddingTop: "24px" }}>
          <button onClick={() => navigate("/")} className="underline-btn">
            {language === "zh" ? "← 返回全部文章" : "← Back to all articles"}
          </button>
        </div>
      </div>
    </div>
  );
}
