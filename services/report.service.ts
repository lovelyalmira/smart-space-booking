import { apiGet } from "@/lib/api";
import { Report } from "@/types";

export const reportService = {
  monthly: (params?: { month?: number; year?: number }) =>
    apiGet<Report>("/api/admin/reports/monthly", params as Record<string, unknown>),
  income: (params?: { month?: number; year?: number }) =>
    apiGet<Report>("/api/admin/reports/income", params as Record<string, unknown>),
};
