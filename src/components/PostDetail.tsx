import { useParams, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import type { BlogPost } from "../../contracts/blog";

interface PostDetailProps {
  posts: BlogPost[];
}

export default function PostDetail({ posts }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);


  const post = posts.find((p) => String(p.id) === String(id));


  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [id]);

  const backText = language === "fr" ? "Retour à l'accueil" : "Back to home";
  const notFoundText = language === "fr" ? "Article non trouvé" : "Article not found";


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
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace", color: "var(--text-charcoal)", background: "none", border: "none", cursor: "pointer" }}>
            {language === "fr" ? "Fermer" : "Close"}
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
          style={{ fontSize: "14px", lineHeight: 2.2, color: "var(--text-charcoal)", letterSpacing: "0.01em" }}
          dangerouslySetInnerHTML={{ __html: content.detailContent }}
        />

        {/* Back link */}
        <div style={{ borderTop: "1px solid var(--border-light)", marginTop: "48px", paddingTop: "24px", marginBottom: "48px" }}>
          <button onClick={() => navigate("/")} className="underline-btn">
            {language === "fr" ? "← Retour à tous les articles" : "← Back to all articles"}
          </button>
        </div>

        {/* Comments Section */}
        <CommentsSection postId={post.id} />
      </div>
    </div>
  );
}

function CommentsSection({ postId }: { postId: string | number }) {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", String(postId)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", String(postId))
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("comments").insert([
      {
        post_id: String(postId),
        user_name: user.name || user.email || "User",
        content: comment.trim(),
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    }
    setIsSubmitting(false);
  };

  const t = {
    fr: {
      title: "Commentaires",
      placeholder: "Laissez un commentaire...",
      submit: "Envoyer",
      submitting: "Envoi...",
      loginToComment: "Connectez-vous pour laisser un commentaire.",
      noComments: "Pas encore de commentaires.",
    },
    en: {
      title: "Comments",
      placeholder: "Leave a comment...",
      submit: "Post",
      submitting: "Posting...",
      loginToComment: "Please log in to leave a comment.",
      noComments: "No comments yet.",
    },
  };
  const s = t[language];

  return (
    <div className="pt-8 border-t border-dashed" style={{ borderColor: "var(--border-light)" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-charcoal)", marginBottom: "24px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {s.title} ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-6 mb-10">
        {isLoading ? (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>...</p>
        ) : comments.length === 0 ? (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>{s.noComments}</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-charcoal)" }}>{c.user_name}</span>
                <span style={{ fontSize: "10px", color: "var(--text-grey)" }}>
                  {new Date(c.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                </span>
              </div>
              <div 
                className="comment-content"
                style={{ 
                  fontSize: "13px", 
                  lineHeight: 1.6, 
                  color: "var(--text-charcoal)",
                }}
                dangerouslySetInnerHTML={{ __html: c.content }}
              />
            </div>
          ))
        )}
      </div>

      {/* Form */}
      {isAuthenticated ? (
        <form onSubmit={submitComment} className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={s.placeholder}
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "13px",
              background: "transparent",
              border: "1px solid var(--border-light)",
              borderRadius: "2px",
              outline: "none",
              color: "var(--text-charcoal)",
              fontFamily: "inherit",
              resize: "none"
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            style={{
              padding: "8px 20px",
              fontSize: "11px",
              fontFamily: "'Space Mono', monospace",
              background: "var(--text-charcoal)",
              color: "white",
              border: "none",
              borderRadius: "2px",
              cursor: (isSubmitting || !comment.trim()) ? "default" : "pointer",
              opacity: (isSubmitting || !comment.trim()) ? 0.6 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {isSubmitting ? s.submitting : s.submit}
          </button>
        </form>
      ) : (
        <p style={{ fontSize: "12px", color: "var(--text-grey)", fontStyle: "italic" }}>{s.loginToComment}</p>
      )}
    </div>
  );
}
