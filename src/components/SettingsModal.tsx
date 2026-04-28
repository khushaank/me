import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "./ImageUpload";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language } = useLanguage();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(""); // Stores which field to show: "current", "new", "confirm" or ""

  const updateMutation = useMutation({
    mutationFn: async (vars: any) => {
      // Note: Supabase doesn't require current password for password update if logged in,
      // but it's good practice. For simplicity with Supabase SDK:
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
        onClose();
        await logout();
        window.location.href = "/login";
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });


  if (!isOpen) return null;

  const handleSubmit = () => {
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
      currentUser: "Utilisateur actuel",
      currentPassword: "Mot de passe actuel",
      newUsername: "Nouveau nom d'utilisateur (optionnel)",
      newPassword: "Nouveau mot de passe (optionnel)",
      confirmPassword: "Confirmer le nouveau mot de passe",
      avatar: "Photo de profil",
      cancel: "ANNULER",
      save: "ENREGISTRER",
      saving: "Enregistrement...",
    },
    en: {
      title: "Account Settings",
      currentUser: "Current User",
      currentPassword: "Current Password",
      newUsername: "New Username (optional)",
      newPassword: "New Password (optional)",
      confirmPassword: "Confirm New Password",
      avatar: "Profile Photo",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
    },
  };
  const s = t[language];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#2A2A2A",
    border: "1px solid #444",
    borderRadius: "2px",
    padding: "10px 12px",
    fontSize: "12px",
    color: "#FFFFFF",
    fontFamily: "'Space Mono', monospace",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    display: "block",
    marginBottom: "6px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
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
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FFFFFF" }}
      >
        {showPassword === field ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        )}
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 200, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4"
        style={{ backgroundColor: "#1A1A1A", borderRadius: "4px", padding: "24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              color: "#FFFFFF",
              textAlign: "center",
              flex: 1,
            }}
          >
            {s.title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFFFFF",
              fontSize: "18px",
              padding: 0,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label style={labelStyle}>{s.currentUser}</label>
            <div
              style={{
                ...inputStyle,
                background: "#222",
                color: "rgba(255,255,255,0.5)",
                cursor: "default",
              }}
            >
              {user?.email}
            </div>
          </div>

          <div>
            <label style={labelStyle}>{s.currentPassword} *</label>
            <PasswordInput 
              value={currentPassword} 
              onChange={setCurrentPassword} 
              field="current" 
            />
          </div>

          <div>
            <label style={labelStyle}>{s.avatar}</label>
            <div className="mt-2">
              <ImageUpload 
                value={avatarUrl} 
                onChange={setAvatarUrl} 
                label="" 
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #333", paddingTop: "12px" }}>
            <label style={labelStyle}>{s.newUsername}</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={user?.name || user?.username}
              style={inputStyle}
            />
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

          {error && <p style={{ fontSize: "11px", color: "#E74C3C" }}>{error}</p>}
          {success && <p style={{ fontSize: "11px", color: "#2ECC71" }}>{success}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {s.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: "#1A1A1A",
              background: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              cursor: updateMutation.isPending ? "wait" : "pointer",
              opacity: updateMutation.isPending ? 0.7 : 1,
            }}
          >
            {updateMutation.isPending ? s.saving : s.save}
          </button>
        </div>
      </div>
    </div>
  );
}
