import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Member } from "@/types";

export interface MemberPayload {
  username?: string;
  password?: string;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string;
}

export const adminMemberService = {
  list: (params?: { search?: string }) =>
    apiGet<Member[]>("/api/admin/members", params as Record<string, unknown>),
  detail: (id: number | string) => apiGet<Member>(`/api/admin/members/${id}`),
  create: (payload: MemberPayload) => apiPost<Member>("/api/admin/members", payload),
  update: (id: number | string, payload: Partial<MemberPayload>) =>
    apiPut<Member>(`/api/admin/members/${id}`, payload),
  remove: (id: number | string) => apiDelete<unknown>(`/api/admin/members/${id}`),
};
