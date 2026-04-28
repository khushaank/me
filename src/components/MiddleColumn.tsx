import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { trpc } from "@/providers/trpc";
import type { BlogPost } from "../../contracts/blog";

gsap.registerPlugin(ScrollTrigger);

interface MiddleColumnProps {
  posts: BlogPost[];
}

export default function MiddleColumn({ posts }: MiddleColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const { leftOpen, rightOpen } = useSidebar();
  const utils = trpc.useUtils();

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => { utils.blog.list.invalidate(); },
  });

  /* Entrance animations for posts */
  useEffect(() => {
    if (!columnRef.current || posts.length === 0) return;
    const articles = columnRef.current.querySelectorAll(".post-card");
    const triggers: ScrollTrigger[] = [];
    articles.forEach((article, i) => {
      gsap.set(article, { opacity: 0, y: 30 });
      const tween = gsap.to(article, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: i * 0.08,
        scrollTrigger: {
          trigger: article,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, [posts]);

  /* Image scroll reveal */
  useEffect(() => {
    if (!columnRef.current) return;
    const images = columnRef.current.querySelectorAll(".blog-image");
    const triggers: ScrollTrigger[] = [];
    images.forEach((img) => {
      gsap.set(img, { opacity: 0, scale: 1.02 });
      const tween = gsap.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: img, start: "top 88%", toggleActions: "play none none none" },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, [posts]);

  const sectionTitle = "MATERIAL / THOUGHTS";

  return (
    <main
      ref={columnRef}
      className="flex-1 overflow-y-auto relative"
      style={{
        height: "calc(100vh - 44px)",
        scrollBehavior: "smooth",
        transition: "padding 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        className="px-4 sm:px-6 md:px-8 lg:px-10 pb-24 mx-auto transition-all duration-500"
        style={{
          maxWidth: leftOpen || rightOpen ? "720px" : "800px",
          paddingTop: "24px",
        }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-grey)",
              lineHeight: 1.4,
            }}
          >
            {sectionTitle}
          </h2>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/new-post")}
              className="btn-outline text-[10px] px-3 py-1.5"
            >
              + NEW POST
            </button>
          )}
        </div>

        {/* Posts list */}
        <div className="space-y-0">
          {posts.map((post) => {
            const content = post[language];
            return (
              <article
                key={post.id}
                className="post-card group cursor-pointer"
                style={{
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: "28px",
                  marginBottom: "28px",
                }}
              >
                <div onClick={() => navigate(`/post/${post.id}`)}>
                  {/* Image */}
                  <div
                    className="blog-image overflow-hidden mb-4"
                    style={{
                      border: "1px solid var(--border-light)",
                      borderRadius: "2px",
                    }}
                    onMouseEnter={() => setHoveredImage(post.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={post.image}
                      alt={content.title}
                      className="w-full h-auto block transition-all duration-500 ease-out"
                      style={{
                        aspectRatio: "16/9",
                        objectFit: "cover",
                        filter: hoveredImage === post.id ? "grayscale(100%) brightness(0.85)" : "none",
                        transform: hoveredImage === post.id ? "scale(1.03)" : "scale(1)",
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: "10px", color: "var(--text-grey)", letterSpacing: "0.05em" }}>{post.year}</span>
                    <span style={{ fontSize: "10px", color: "var(--border-light)" }}>/</span>
                    <span
                      className="uppercase"
                      style={{ fontSize: "10px", color: "var(--accent-teal)", letterSpacing: "0.06em" }}
                    >
                      {content.collection}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="group-hover:opacity-70 transition-opacity duration-300"
                    style={{
                      fontSize: "clamp(15px, 2vw, 18px)",
                      fontWeight: 400,
                      lineHeight: 1.35,
                      color: "var(--text-charcoal)",
                      marginBottom: "4px",
                    }}
                  >
                    {content.title}
                  </h3>

                  {/* Subtitle */}
                  <p style={{ fontSize: "12px", color: "var(--text-grey)", lineHeight: 1.55, marginBottom: "8px" }}>
                    {content.subtitle}
                  </p>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-grey)",
                      lineHeight: 1.65,
                      opacity: 0.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {content.content}
                  </p>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}?mode=edit`); }}
                      style={{ fontSize: "9px", color: "var(--text-grey)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm("Delete this post?")) deletePost.mutate({ id: post.id }); }}
                      style={{ fontSize: "9px", color: "#E74C3C", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}
                    >
                      DELETE
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-8 pb-4 text-center">
          <p style={{ fontSize: "10px", color: "var(--text-grey)", letterSpacing: "0.05em" }}>
            — Khushaank Gupta, {new Date().getFullYear()} —
          </p>
        </div>
      </div>
    </main>
  );
}
