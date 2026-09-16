import { apiGet, apiPost } from "@/lib/api";
import { Discount, DiscountCheckResult } from "@/types";

export const discountService = {
  active: () => apiGet<Discount[]>("/api/diskon/active"),
  detail: (id: number | string) => apiGet<Discount>(`/api/diskon/${id}`),
  check: (nama_diskon: string) =>
    apiPost<DiscountCheckResult>("/api/diskon/check", { nama_diskon }),
};
