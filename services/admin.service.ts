import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { CoworkingProfile, Discount, Space } from "@/types";

export interface SpacePayload {
  nama_space: string;
  tipe: string;
  kapasitas: number;
  harga_per_jam: number;
  deskripsi?: string;
  foto?: string;
}

export interface DiscountPayload {
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
}

export interface ProfilePayload {
  nama_coworking?: string;
  nama_pemilik?: string;
  telp?: string;
}

export const adminService = {
  // profile
  getProfile: () => apiGet<CoworkingProfile>("/api/admin/profile"),
  updateProfile: (payload: ProfilePayload) => apiPut<CoworkingProfile>("/api/admin/profile", payload),

  // spaces
  spaces: () => apiGet<Space[]>("/api/admin/spaces"),
  spaceDetail: (id: number | string) => apiGet<Space>(`/api/admin/spaces/${id}`),
  createSpace: (payload: SpacePayload) => apiPost<Space>("/api/admin/spaces", payload),
  updateSpace: (id: number | string, payload: Partial<SpacePayload>) =>
    apiPut<Space>(`/api/admin/spaces/${id}`, payload),
  removeSpace: (id: number | string) => apiDelete<unknown>(`/api/admin/spaces/${id}`),

  // discounts
  discounts: () => apiGet<Discount[]>("/api/admin/diskon"),
  discountDetail: (id: number | string) => apiGet<Discount>(`/api/admin/diskon/${id}`),
  createDiscount: (payload: DiscountPayload) => apiPost<Discount>("/api/admin/diskon", payload),
  updateDiscount: (id: number | string, payload: Partial<DiscountPayload>) =>
    apiPut<Discount>(`/api/admin/diskon/${id}`, payload),
  removeDiscount: (id: number | string) => apiDelete<unknown>(`/api/admin/diskon/${id}`),
};
