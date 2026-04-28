import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;
    
    setIsPending(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    
    if (error) {
      setError(error.message);
      setIsPending(false);
    } else {
      window.location.href = "/";
    }
  };

  const t = {
    zh: {
      title: "管理员登入",
      username: "邮箱",
      password: "密码",
      submit: "登入",
      submitting: "登入中...",
      hint: "使用 Supabase 账户登入",
    },
    en: {
      title: "Admin Login",
      username: "Email",
      password: "Password",
      submit: "Log In",
      submitting: "Logging in...",
      hint: "Use your Supabase account",
    },
  };
  const s = t[language];


  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      <div
        className="w-full max-w-sm mx-4"
        style={{
          border: "1px solid var(--border-light)",
          padding: "32px",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-charcoal)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {s.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              style={{
                fontSize: "11px",
                color: "var(--text-grey)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              {s.username}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid var(--border-light)",
                padding: "10px 12px",
                fontSize: "12px",
                color: "var(--text-charcoal)",
                fontFamily: "'Space Mono', monospace",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "11px",
                color: "var(--text-grey)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              {s.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid var(--border-light)",
                padding: "10px 12px",
                fontSize: "12px",
                color: "var(--text-charcoal)",
                fontFamily: "'Space Mono', monospace",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "11px", color: "#E74C3C" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: "var(--bg-warm-white)",
              background: "var(--text-charcoal)",
              border: "none",
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.7 : 1,
              letterSpacing: "0.05em",
            }}
          >
            {isPending ? s.submitting : s.submit}
          </button>
        </form>

        <p
          style={{
            fontSize: "11px",
            color: "var(--text-grey)",
            marginTop: "16px",
            textAlign: "center",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {s.hint}
        </p>
      </div>
    </div>
  );
}
