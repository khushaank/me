import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "@/components/ImageUpload";
import gsap from "gsap";

export default function Settings() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(""); 

  const pageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (user) {
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user, isAuthenticated, isAuthLoading, navigate]);

  const updateMutation = useMutation({
    mutationFn: async (vars: any) => {
      if (vars.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: vars.newPassword });
        if (error) throw error;
      }
      if (vars.newUsername || vars.avatarUrl !== undefined) {
        const { error } = await supabase.auth.updateUser({ 
          data: { 
            name: vars.newUsername || user?.name,
            avatar_url: vars.avatarUrl !== undefined ? vars.avatarUrl : user?.avatarUrl
          } 
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setSuccess(language === "fr" ? "Mis à jour. Veuillez vous reconnecter." : "Updated. Please log in again.");
      setTimeout(async () => {
        setSuccess("");
        await logout();
        navigate("/login");
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError(language === "fr" ? "Les nouveaux mots de passe ne correspondent pas" : "New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError(language === "fr" ? "Le nouveau mot de passe doit comporter au moins 6 caractères" : "Password must be at least 6 characters");
      return;
    }

    updateMutation.mutate({
      currentPassword,
      newUsername: newUsername || undefined,
      newPassword: newPassword || undefined,
      avatarUrl: avatarUrl !== user?.avatarUrl ? avatarUrl : undefined,
    });
  };

  const t = {
    fr: {
      title: "Paramètres du compte",
      subtitle: "Gérez vos informations personnelles et votre sécurité",
      currentUser: "Utilisateur actuel",
      currentPassword: "Mot de passe actuel",
      newUsername: "Nouveau nom d'utilisateur (optionnel)",
      newPassword: "Nouveau mot de passe (optionnel)",
      confirmPassword: "Confirmer le nouveau mot de passe",
      avatar: "Photo de profil",
      cancel: "RETOUR",
      save: "ENREGISTRER LES MODIFICATIONS",
      saving: "Enregistrement...",
    },
    en: {
      title: "Account Settings",
      subtitle: "Manage your personal information and security",
      currentUser: "Current User",
      currentPassword: "Current Password",
      newUsername: "New Username (optional)",
      newPassword: "New Password (optional)",
      confirmPassword: "Confirm New Password",
      avatar: "Profile Photo",
      cancel: "GO BACK",
      save: "SAVE CHANGES",
      saving: "Saving...",
    },
  };
  const s = t[language];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-light)",
    borderRadius: "4px",
    padding: "12px 14px",
    fontSize: "13px",
    color: "var(--text-charcoal)",
    fontFamily: "'Space Mono', monospace",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "var(--text-grey)",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const PasswordInput = ({ value, onChange, placeholder, field }: any) => (
    <div className="relative">
      <input
        type={showPassword === field ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: "40px" }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(showPassword === field ? "" : field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-charcoal)" }}
      >
        {showPassword === field ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        )}
      </button>
    </div>
  );

  if (isAuthLoading) return null;

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-12 px-4 md:py-20"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      <div ref={pageRef} className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="space-y-2 border-b border-[var(--border-light)] pb-8">
          <h1 
            style={{ 
              fontSize: "24px", 
              fontWeight: 500, 
              color: "var(--text-charcoal)",
              letterSpacing: "-0.02em"
            }}
          >
            {s.title}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-grey)" }}>
            {s.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Profile */}
          <section className="space-y-6">
            <h2 style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-charcoal)", letterSpacing: "0.1em" }} className="uppercase">
              {language === "fr" ? "Profil" : "Profile"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label style={labelStyle}>{s.currentUser}</label>
                  <div
                    style={{
                      ...inputStyle,
                      background: "rgba(0,0,0,0.02)",
                      color: "var(--text-grey)",
                      cursor: "not-allowed",
                      borderStyle: "dashed"
                    }}
                  >
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{s.newUsername}</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={user?.name || user?.username}
                    style={inputStyle}
                    className="focus:border-[var(--text-charcoal)]"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{s.avatar}</label>
                <div className="mt-2">
                  <ImageUpload 
                    value={avatarUrl} 
                    onChange={setAvatarUrl} 
                    label="" 
                    variant="light"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Security */}
          <section className="space-y-6 pt-8 border-t border-[var(--border-light)]">
            <h2 style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-charcoal)", letterSpacing: "0.1em" }} className="uppercase">
              {language === "fr" ? "Sécurité" : "Security"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label style={labelStyle}>{s.currentPassword} *</label>
                <div className="max-w-md">
                  <PasswordInput 
                    value={currentPassword} 
                    onChange={setCurrentPassword} 
                    field="current" 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{s.newPassword}</label>
                <PasswordInput 
                  value={newPassword} 
                  onChange={setNewPassword} 
                  field="new" 
                />
              </div>

              <div>
                <label style={labelStyle}>{s.confirmPassword}</label>
                <PasswordInput 
                  value={confirmPassword} 
                  onChange={setConfirmPassword} 
                  field="confirm" 
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-xs">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[var(--border-light)]">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-filled py-3 px-8 text-[12px] flex-1 sm:flex-none order-1 sm:order-2"
              style={{ minWidth: "200px" }}
            >
              {updateMutation.isPending ? s.saving : s.save}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline py-3 px-8 text-[12px] flex-1 sm:flex-none order-2 sm:order-1"
            >
              {s.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
