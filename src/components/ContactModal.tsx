import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const t = {
  zh: {
    title: "留言",
    nameLabel: "你的名字（可选）",
    namePlaceholder: "匿名",
    messageLabel: "留言内容",
    messagePlaceholder: "写下你想说的话...",
    cancel: "取消",
    send: "发送",
    sent: "留言已发送！",
    sending: "发送中...",
    error: "发送失败，请重试",
    emptyMessage: "请输入留言内容",
    viewGuestbook: "去看看留言板 →",
  },
  en: {
    title: "Leave a Message",
    nameLabel: "Your name (optional)",
    namePlaceholder: "Anonymous",
    messageLabel: "Your message",
    messagePlaceholder: "Write what you want to say...",
    cancel: "Cancel",
    send: "Send",
    sent: "Message sent!",
    sending: "Sending...",
    error: "Failed to send, please try again",
    emptyMessage: "Please enter a message",
    viewGuestbook: "View guestbook →",
  },
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const s = t[language];
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSend = async () => {
    setError("");
    if (!message.trim()) {
      setError(s.emptyMessage);
      return;
    }
    
    setIsPending(true);
    const { error } = await supabase.from('messages').insert([
      { 
        name: name.trim() || null, 
        message: message.trim(),
        subject: "Contact Form",
        email: null // Could add email field to UI later
      }
    ]);

    if (error) {
      setError(s.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setName("");
      setMessage("");
      setIsPending(false);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4"
        style={{
          backgroundColor: "#1A1A1A",
          borderRadius: "4px",
          padding: "24px",
        }}
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
            {success ? s.sent : s.title}
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

        {!success && (
          <>
            <div className="space-y-4">
              {/* Name field */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-grey)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {s.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={s.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid var(--text-grey)",
                    borderRadius: "2px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    fontFamily: "'Space Mono', monospace",
                    outline: "none",
                  }}
                />
              </div>

              {/* Message field */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--text-grey)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {s.messageLabel}
                </label>
                <textarea
                  rows={6}
                  placeholder={s.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid var(--text-grey)",
                    borderRadius: "2px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                    fontFamily: "'Space Mono', monospace",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: "11px", color: "#E74C3C", marginTop: "4px" }}>
                  {error}
                </p>
              )}
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
                onClick={handleSend}
                disabled={isPending}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                  color: "#1A1A1A",
                  background: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isPending ? "wait" : "pointer",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? s.sending : s.send}
              </button>
            </div>

            {/* Guestbook link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  onClose();
                  navigate("/guestbook");
                }}
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Space Mono', monospace",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {s.viewGuestbook}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
