import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Guestbook() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });


  const t = {
    zh: {
      title: "留言板",
      back: "返回首页",
      empty: "还没有留言",
      loading: "加载中...",
      anon: "匿名",
      delete: "删除",
    },
    en: {
      title: "Guestbook",
      back: "Back to home",
      empty: "No messages yet",
      loading: "Loading...",
      anon: "Anonymous",
      delete: "Delete",
    },
  };
  const s = t[language];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-warm-white)" }}
    >
      {/* Top Bar */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6"
        style={{
          height: "40px",
          zIndex: 50,
          backgroundColor: "var(--bg-warm-white)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--text-charcoal)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          NEURAL ATELIER (BLOG)
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "12px",
            fontFamily: "'Space Mono', monospace",
            color: "var(--text-charcoal)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {s.back}
        </button>
      </header>

      {/* Content */}
      <div className="mx-auto" style={{ maxWidth: "680px", padding: "80px 24px 80px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "var(--text-charcoal)",
            marginBottom: "32px",
          }}
        >
          {s.title}
        </h1>

        {isLoading ? (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>{s.loading}</p>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: "16px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "var(--text-charcoal)",
                    }}
                  >
                    {msg.name || s.anon}
                  </span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "11px", color: "var(--text-grey)" }}>
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString(
                            language === "zh" ? "zh-CN" : "en-US",
                          )
                        : ""}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this message?")) {
                            deleteMutation.mutate({ id: msg.id });
                          }
                        }}
                        style={{
                          fontSize: "10px",
                          color: "#E74C3C",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'Space Mono', monospace",
                        }}
                      >
                        {s.delete}
                      </button>
                    )}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.8,
                    color: "var(--text-charcoal)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "var(--text-grey)" }}>{s.empty}</p>
        )}
      </div>
    </div>
  );
}
