import { apiGet } from "@/lib/api";
import { AvailabilitySpace, Space, SpaceTypeInfo } from "@/types";

export interface AvailabilityQuery {
  id_space: number;
  tanggal: string;
  jam_mulai: string;
  durasi_jam: number;
}

export const spaceService = {
  types: () => apiGet<SpaceTypeInfo[]>("/api/spaces/types"),

  list: (params?: { tipe?: string; search?: string }) =>
    apiGet<Space[]>("/api/spaces", params as Record<string, unknown>),

  detail: (id: number | string) => apiGet<Space>(`/api/spaces/${id}`),

  availability: (q: AvailabilityQuery) =>
    apiGet<AvailabilitySpace[]>("/api/spaces/availability", q as unknown as Record<string, unknown>),
};
