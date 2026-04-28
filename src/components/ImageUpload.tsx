import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  variant?: "dark" | "light";
}

export default function ImageUpload({ value, onChange, label, variant = "dark" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const isDark = variant === "dark";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      setPreview(null);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Network error"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };


  const handleRemove = () => {
    onChange("");
    setPreview(null);
  };

  const displayUrl = preview || value;

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: isDark ? "rgba(255,255,255,0.6)" : "var(--text-grey)",
    display: "block",
    marginBottom: "6px",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
  };

  const emptyBoxStyle: React.CSSProperties = {
    width: "100%",
    height: "120px",
    border: isDark ? "1px dashed #444" : "1px dashed var(--border-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
    color: isDark ? "rgba(255,255,255,0.3)" : "var(--text-grey)",
    fontSize: "11px",
    fontFamily: "'Space Mono', monospace",
  };

  const btnUploadStyle: React.CSSProperties = {
    fontSize: "10px",
    padding: "5px 14px",
    background: isDark ? "#FFFFFF" : "var(--text-charcoal)",
    color: isDark ? "#1A1A1A" : "#FFFFFF",
    border: "none",
    borderRadius: "2px",
    cursor: uploading ? "wait" : "pointer",
    opacity: uploading ? 0.6 : 1,
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
  };

  const btnRemoveStyle: React.CSSProperties = {
    fontSize: "10px",
    padding: "5px 14px",
    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    color: isDark ? "#FFFFFF" : "var(--text-charcoal)",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    letterSpacing: "0.05em",
  };

  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}

      {displayUrl ? (
        <div style={{ marginBottom: "8px", position: "relative" }}>
          <img
            src={displayUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              border: isDark ? "1px solid #444" : "1px solid var(--border-light)",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div style={emptyBoxStyle}>No image</div>
      )}

      <div className="flex gap-2">
        <button onClick={() => inputRef.current?.click()} disabled={uploading} style={btnUploadStyle}>
          {uploading ? "UPLOADING..." : "UPLOAD"}
        </button>
        {value && (
          <button onClick={handleRemove} style={btnRemoveStyle}>
            REMOVE
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
}
