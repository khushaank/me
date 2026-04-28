import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ShaderCanvas from "./ShaderCanvas";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface LeftColumnProps {
  onContactClick: () => void;
}

const fallbackText = {
  fr: "Khushaank Gupta — écrivain et penseur à l'intersection de l'IA, de la technologie, des affaires et du développement personnel. J'explore comment l'intelligence artificielle redéfinit nos vies, nos carrières et nos modes de pensée, tout en restant ancré dans les principes intemporels de la stratégie commerciale et de la sagesse financière. Des innovations de la Silicon Valley aux mouvements de Wall Street, des percées du deep learning aux gains discrets des habitudes quotidiennes — je crois que la véritable croissance se produit là où la technologie rencontre l'humanité. Conseiller produit pour des startups technologiques et investisseur indépendant.",
  en: "Khushaank Gupta — writer and thinker at the intersection of AI, technology, business, and personal growth. I explore how artificial intelligence is reshaping our lives, careers, and patterns of thinking, while staying grounded in the timeless principles of business strategy and financial wisdom. From Silicon Valley innovations to Wall Street movements, from deep learning breakthroughs to the quiet gains of daily habits — I believe the real growth happens where technology meets humanity. Product advisor to tech startups and independent investor.",
};

export default function LeftColumn({ onContactClick }: LeftColumnProps) {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const { leftOpen, closeAll } = useSidebar();
  const queryClient = useQueryClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: bio } = useQuery({
    queryKey: ['profileBio'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profile_bio').select('*').eq('id', 1).single();
      if (error) return null;
      return data;
    }
  });

  const updateBio = useMutation({
    mutationFn: async (vars: any) => {
      const { error } = await supabase.from('profile_bio').update({
        fr_text: vars.frText,
        en_text: vars.enText,
        email: vars.email,
        instagram: vars.instagram
      }).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profileBio'] }),
  });


  const [isEditing, setIsEditing] = useState(false);
  const [editFr, setEditFr] = useState("");
  const [editEn, setEditEn] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editInstagram, setEditInstagram] = useState("");

  const profileText = {
    fr: bio?.fr_text || fallbackText.fr,
    en: bio?.en_text || fallbackText.en,
  };

  const email = bio?.email || "khushaank@gmail.com";
  const instagram = bio?.instagram || "https://instagram.com";

  const startEdit = () => {
    setEditFr(profileText.fr);
    setEditEn(profileText.en);
    setEditEmail(email);
    setEditInstagram(instagram);
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateBio.mutate({ frText: editFr, enText: editEn, email: editEmail, instagram: editInstagram });
    setIsEditing(false);
  };

  /* Animate panel open / close */
  useEffect(() => {
    if (!panelRef.current) return;
    if (leftOpen) {
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, delay: 0.15, ease: "power2.out" }
        );
      }
    } else {
      gsap.to(panelRef.current, {
        x: -320,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [leftOpen]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "6px 8px",
    fontSize: "11px",
    color: "#FFFFFF",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Space Mono', monospace",
    borderRadius: "2px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "9px",
    color: "rgba(255,255,255,0.5)",
    display: "block",
    marginBottom: "4px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    fontFamily: "'Space Mono', monospace",
  };

  return (
    <aside
      ref={panelRef}
      className="fixed top-[44px] left-0 bottom-0 z-[36] flex flex-col overflow-hidden"
      style={{
        width: "300px",
        maxWidth: "85vw",
        transform: "translateX(-320px)",
        willChange: "transform",
      }}
    >
      <ShaderCanvas />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col h-full p-5 md:p-6"
        style={{ mixBlendMode: "difference" }}
      >
        {/* Close button */}
        <button
          onClick={closeAll}
          className="absolute top-4 right-4 z-20 md:hidden"
          style={{ color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Profile header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                lineHeight: 1.4,
              }}
            >
              PROFILE
            </h2>
            {isAdmin && !isEditing && (
              <button
                onClick={startEdit}
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.5)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {language === "fr" ? "MODIFIER" : "EDIT"}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label style={labelStyle}>Email</label>
                <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input type="text" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} style={{ ...inputStyle, resize: "none" }} />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <a href={`mailto:${email}`} className="profile-link block">
                {email}
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="profile-link block">
                Instagram
              </a>
            </div>
          )}
        </div>

        {/* Bio text */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }} className="sidebar-scroll">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label style={labelStyle}>{language === "fr" ? "Bio en français" : "French Bio"}</label>
                <textarea value={editFr} onChange={(e) => setEditFr(e.target.value)} rows={6} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{language === "fr" ? "Bio en anglais" : "English Bio"}</label>
                <textarea value={editEn} onChange={(e) => setEditEn(e.target.value)} rows={6} style={inputStyle} />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={saveEdit} className="btn-light text-[10px] px-3 py-1.5">
                  {language === "fr" ? "ENREGISTRER" : "SAVE"}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-dark text-[10px] px-3 py-1.5">
                  {language === "fr" ? "ANNULER" : "CANCEL"}
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                fontSize: "11px",
                lineHeight: 1.85,
                color: "#FFFFFF",
                maxWidth: "240px",
                textAlign: "left",
              }}
            >
              {profileText[language]}
            </p>
          )}
        </div>

        {/* Contact button */}
        <div style={{ flexShrink: 0, paddingTop: "16px" }}>
          <button
            onClick={onContactClick}
            className="w-full text-left"
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.7"; }}
          >
            {language === "fr" ? "Me contacter" : "Get in Touch"} →
          </button>
        </div>
      </div>
    </aside>
  );
}
