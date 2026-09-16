"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadService } from "@/services/upload.service";
import { getImageUrl } from "@/lib/image";
import { getApiErrorMessage } from "@/lib/api";

type Kind = "member" | "space" | "image";

export function ImageUpload({
  kind,
  value,
  onChange,
  fallback,
}: {
  kind: Kind;
  value?: string | null;
  onChange: (url: string) => void;
  fallback?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const preview = value ? getImageUrl(value, null, "") : fallback || "";

  const handleFile = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const fn = kind === "member" ? uploadService.member : kind === "space" ? uploadService.space : uploadService.image;
      const res = await fn(file);
      const url = (res.url || res.foto_url || res.path || "") as string;
      if (!url) throw new Error("URL gambar tidak ditemukan pada respons upload.");
      onChange(url);
      toast.success("Gambar berhasil diupload.");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-slate-50">
        {preview ? (
          <>
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white"><X className="h-3 w-3" /></button>
          </>
        ) : (
          <ImageIcon className="h-7 w-7 text-slate-300" />
        )}
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload Foto
        </Button>
        <p className="mt-1 text-xs text-slate-400">PNG/JPG, opsional</p>
      </div>
    </div>
  );
}
