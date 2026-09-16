import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { Reservation } from "@/types";

export interface AdminReservationFilter {
  month?: number;
  year?: number;
  status?: string;
  id_space?: number;
  tanggal?: string;
}

export const adminReservationService = {
  list: (filter?: AdminReservationFilter) =>
    apiGet<Reservation[]>("/api/admin/reservasi", filter as Record<string, unknown>),
  updateStatus: (id: number | string, status: string) =>
    apiPatch<Reservation>(`/api/admin/reservasi/${id}/status`, { status }),
  checkIn: (id: number | string) => apiPost<Reservation>(`/api/admin/reservasi/${id}/check-in`),
  checkOut: (id: number | string) => apiPost<Reservation>(`/api/admin/reservasi/${id}/check-out`),
};
