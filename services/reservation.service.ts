import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { ETicket, HistoryResult, Reservation } from "@/types";

export interface CreateReservationPayload {
  id_space: number;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  id_diskon?: number;
  kode_promo?: string;
}

export const reservationService = {
  create: (payload: CreateReservationPayload) =>
    apiPost<Reservation>("/api/reservasi", payload),

  my: () => apiGet<Reservation[]>("/api/reservasi/my"),

  history: (month: number, year: number) =>
    apiGet<HistoryResult>("/api/reservasi/my/history", { month, year }),

  detail: (id: number | string) => apiGet<Reservation>(`/api/reservasi/${id}`),

  eTicket: (id: number | string) => apiGet<ETicket>(`/api/reservasi/${id}/e-ticket`),

  cancel: (id: number | string) => apiPatch<Reservation>(`/api/reservasi/${id}/cancel`),
};
