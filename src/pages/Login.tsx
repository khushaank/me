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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;
    
    setIsPending(true);
    
    const { data, error } = isSignUp 
      ? await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              name: name.trim() || undefined
            }
          }
        })
      : await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
    
    if (error) {
      setError(error.message);
      setIsPending(false);
    } else {
      if (isSignUp && data.user && !data.session) {
        // Confirmation email sent
        setError(language === "fr" ? "Vérifiez votre e-mail pour confirmer." : "Check your email to confirm.");
        setIsPending(false);
      } else {
        window.location.href = "/";
      }
    }
  };

  const t = {
    fr: {
      title: "Connexion Admin",
      signupTitle: "Créer un compte",
      name: "Nom complet",
      username: "E-mail",
      password: "Mot de passe",
      submit: "CONNEXION",
      signupSubmit: "S'INSCRIRE",
      submitting: "Traitement...",
      hint: "Utilisez votre compte Supabase",
      toggleToSignup: "Pas de compte ? S'inscrire",
      toggleToLogin: "Déjà un compte ? Se connecter",
    },
    en: {
      title: "Admin Login",
      signupTitle: "Create Account",
      name: "Full Name",
      username: "Email",
      password: "Password",
      submit: "Log In",
      signupSubmit: "Sign Up",
      submitting: "Processing...",
      hint: "Use your Supabase account",
      toggleToSignup: "No account? Sign up",
      toggleToLogin: "Have an account? Log in",
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
          {isSignUp ? s.signupTitle : s.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label
                style={{
                  fontSize: "11px",
                  color: "var(--text-grey)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                {s.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          )}
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

          <div className="relative">
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px solid var(--border-light)",
                  padding: "10px 40px 10px 12px",
                  fontSize: "12px",
                  color: "var(--text-charcoal)",
                  fontFamily: "'Space Mono', monospace",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-charcoal)" }}
              >
                {showPassword ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
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
            {isPending ? s.submitting : (isSignUp ? s.signupSubmit : s.submit)}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          style={{
            width: "100%",
            marginTop: "16px",
            background: "none",
            border: "none",
            color: "var(--accent-teal)",
            fontSize: "11px",
            fontFamily: "'Space Mono', monospace",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isSignUp ? s.toggleToLogin : s.toggleToSignup}
        </button>

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
