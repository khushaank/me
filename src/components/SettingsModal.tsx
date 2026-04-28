import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateMutation = useMutation({
    mutationFn: async (vars: any) => {
      // Note: Supabase doesn't require current password for password update if logged in,
      // but it's good practice. For simplicity with Supabase SDK:
      if (vars.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: vars.newPassword });
        if (error) throw error;
      }
      if (vars.newUsername) {
        const { error } = await supabase.auth.updateUser({ data: { name: vars.newUsername } });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setSuccess(language === "zh" ? "已更新，请重新登入" : "Updated. Please log in again.");
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
      setError(language === "zh" ? "新密码不一致" : "New passwords do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError(language === "zh" ? "新密码至少6位" : "Password must be at least 6 characters");
      return;
    }

    updateMutation.mutate({
      currentPassword,
      newUsername: newUsername || undefined,
      newPassword: newPassword || undefined,
    });
  };

  const t = {
    zh: {
      title: "账户设置",
      currentUser: "当前用户",
      currentPassword: "当前密码",
      newUsername: "新用户名（可选）",
      newPassword: "新密码（可选）",
      confirmPassword: "确认新密码",
      cancel: "取消",
      save: "保存",
      saving: "保存中...",
    },
    en: {
      title: "Account Settings",
      currentUser: "Current User",
      currentPassword: "Current Password",
      newUsername: "New Username (optional)",
      newPassword: "New Password (optional)",
      confirmPassword: "Confirm New Password",
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
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
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
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>{s.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
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
