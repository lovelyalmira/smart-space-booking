import api from "@/lib/api";

export interface UploadResult {
  filename?: string;
  url?: string;
  foto_url?: string;
  path?: string;
  [key: string]: unknown;
}

async function uploadTo(endpoint: string, file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post(endpoint, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return (res.data.data || res.data) as UploadResult;
}

export const uploadService = {
  image: (file: File) => uploadTo("/api/upload/image", file),
  space: (file: File) => uploadTo("/api/upload/spaces", file),
  member: (file: File) => uploadTo("/api/upload/members", file),
};
