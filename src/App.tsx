import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router";
import LeftColumn from "./components/LeftColumn";
import MiddleColumn from "./components/MiddleColumn";
import RightColumn from "./components/RightColumn";
import PostDetail from "./components/PostDetail";
import ContactModal from "./components/ContactModal";
import SettingsModal from "./components/SettingsModal";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "../contracts/blog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Guestbook from "./pages/Guestbook";
import NewPost from "./pages/NewPost";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  ToggleBar — header controls                                       */
/* ------------------------------------------------------------------ */
function ToggleBar({ onSettingsClick }: { onSettingsClick?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, isLoading, isAdmin, logout } = useAuth();
  const { toggleLeft, toggleRight } = useSidebar();
  const navigate = useNavigate();

  const btnClass = "header-btn";

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Sidebar toggles — always visible */}
      <button onClick={toggleLeft} className={btnClass} title={language === "zh" ? "打开侧边栏" : "Open sidebar"}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <button onClick={toggleRight} className={btnClass} title={language === "zh" ? "打开档案" : "Open archive"}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      <div className="w-px h-4 bg-[var(--border-light)] hidden sm:block" />

      {/* Auth / Settings */}
      {isLoading ? null : isAuthenticated ? (
        <>
          {isAdmin && onSettingsClick && (
            <button onClick={onSettingsClick} className={btnClass} title={language === "zh" ? "账户设置" : "Account Settings"}>
              &#9881;
            </button>
          )}
          <span onClick={logout} className={`${btnClass} hidden sm:inline`}>
            {user?.username || user?.name || "ADMIN"}
          </span>
        </>
      ) : (
        <button onClick={() => navigate("/login")} className={btnClass}>
          <span className="hidden sm:inline">{language === "zh" ? "登入" : "LOG IN"}</span>
          <svg className="sm:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      )}

      {/* Language Toggle */}
      <button onClick={toggleLanguage} className={`${btnClass} hidden sm:block`}>
        {language === "zh" ? "中 / EN" : "ZH / en"}
      </button>

      {/* Theme Toggle */}
      <button onClick={toggleTheme} className={btnClass}>
        {theme === "light" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Backdrop — click to close sidebars                                */
/* ------------------------------------------------------------------ */
function Backdrop() {
  const { anyOpen, closeAll } = useSidebar();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (anyOpen) {
      gsap.to(ref.current, { opacity: 1, duration: 0.3, ease: "power2.out", pointerEvents: "auto" });
    } else {
      gsap.to(ref.current, { opacity: 0, duration: 0.25, ease: "power2.in", pointerEvents: "none" });
    }
  }, [anyOpen]);

  return (
    <div
      ref={ref}
      onClick={closeAll}
      className="fixed inset-0 z-[35] bg-black/20 backdrop-blur-[2px]"
      style={{ opacity: 0, pointerEvents: "none" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  HomePage — three-column layout with collapsible sidebars           */
/* ------------------------------------------------------------------ */
function HomePage({ posts, isLoading }: { posts: BlogPost[], isLoading: boolean }) {
  const [showContact, setShowContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-warm-white)" }}>
      {/* Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 md:px-6"
        style={{
          height: "44px",
          zIndex: 40,
          backgroundColor: "var(--bg-warm-white)",
          borderBottom: "1px solid var(--border-light)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span
          className="font-medium tracking-wider uppercase select-none"
          style={{ fontSize: "11px", color: "var(--text-charcoal)", letterSpacing: "0.08em" }}
        >
          KHUSHAANK GUPTA
        </span>
        <ToggleBar onSettingsClick={() => setShowSettings(true)} />
      </header>

      {/* Main content area */}
      <div className="relative" style={{ paddingTop: "44px", height: "100vh" }}>
        <Backdrop />

        {/* Left Sidebar — slide-out panel */}
        <LeftColumn onContactClick={() => setShowContact(true)} />

        {/* Middle Column — blog feed */}
        {isLoading ? (
          <main
            className="flex-1 flex items-center justify-center"
            style={{ borderRight: "1px solid var(--border-light)", height: "calc(100vh - 44px)" }}
          >
            <div className="w-full max-w-xl px-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="skeleton-shimmer w-full aspect-video" />
                  <div className="skeleton-shimmer w-3/4 h-4" />
                  <div className="skeleton-shimmer w-1/2 h-3" />
                </div>
              ))}
            </div>
          </main>
        ) : (
          <MiddleColumn posts={posts} />
        )}

        {/* Right Sidebar — slide-out panel */}
        <RightColumn />
      </div>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PostPage — detail view                                            */
/* ------------------------------------------------------------------ */
function PostPage({ posts, isLoading }: { posts: BlogPost[], isLoading: boolean }) {
  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-warm-white)" }}>Loading...</div>;
  return <PostDetail posts={posts} />;
}

/* ------------------------------------------------------------------ */
/*  App — root with all providers                                      */
/* ------------------------------------------------------------------ */
export default function App() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, content, image, image_url, views, created_at, slug, claps, file_url, year, sort_order, clicks_count, zh_title, zh_subtitle, zh_collection, zh_content, zh_detail_content, en_title, en_subtitle, en_collection, en_content, en_detail_content');
      
      if (error) throw error;
      
      return (data || []).map((p: any) => ({
        id: p.id,
        year: p.year || "2024",
        image: p.image || p.image_url || "/images/hero-art.jpg",
        zh: {
          title: p.zh_title || p.title || "Untitled",
          subtitle: p.zh_subtitle || p.excerpt || "",
          collection: p.zh_collection || p.category || "General",
          content: p.zh_content || p.content || "",
          detailContent: p.zh_detail_content || p.content || "",
        },
        en: {
          title: p.en_title || p.title || "Untitled",
          subtitle: p.en_subtitle || p.excerpt || "",
          collection: p.en_collection || p.category || "General",
          content: p.en_content || p.content || "",
          detailContent: p.en_detail_content || p.content || "",
        }
      })) as BlogPost[];
    }

  });

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<HomePage posts={posts} isLoading={isLoading} />} />
            <Route path="/post/:id" element={<PostPage posts={posts} isLoading={isLoading} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/guestbook" element={<Guestbook />} />
            <Route path="/admin/new-post" element={<NewPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

