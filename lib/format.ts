import dayjs from "dayjs";
import { ReservationStatus, SpaceTypeKey } from "@/types";

export function formatCurrency(value?: number | null): string {
  const n = typeof value === "number" ? value : 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  return dayjs(value).format("DD MMM YYYY");
}

export function formatDateLong(value?: string | null): string {
  if (!value) return "-";
  return dayjs(value).format("dddd, DD MMMM YYYY");
}

export function toInputDate(value?: string | null): string {
  if (!value) return "";
  return dayjs(value).format("YYYY-MM-DD");
}

export function endTime(jamMulai: string, durasi: number): string {
  if (!jamMulai) return "-";
  const [h, m] = jamMulai.split(":").map(Number);
  const total = h * 60 + m + durasi * 60;
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

export const SPACE_TYPE_LABEL: Record<SpaceTypeKey, string> = {
  desk: "Personal Desk",
  meeting_room: "Meeting Room",
  private_office: "Private Office",
};

export function spaceTypeLabel(tipe?: string): string {
  if (!tipe) return "-";
  return SPACE_TYPE_LABEL[tipe as SpaceTypeKey] || tipe;
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  belum_dikonfirm: "Belum Dikonfirmasi",
  disetujui: "Disetujui",
  aktif: "Aktif / Digunakan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export function statusLabel(status?: string): string {
  if (!status) return "-";
  return STATUS_LABEL[status as ReservationStatus] || status;
}

export const STATUS_BADGE_CLASS: Record<ReservationStatus, string> = {
  belum_dikonfirm: "bg-amber-100 text-amber-700 border-amber-200",
  disetujui: "bg-blue-100 text-blue-700 border-blue-200",
  aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
  selesai: "bg-slate-100 text-slate-700 border-slate-200",
  dibatalkan: "bg-rose-100 text-rose-700 border-rose-200",
};

export function statusBadgeClass(status?: string): string {
  return STATUS_BADGE_CLASS[status as ReservationStatus] || "bg-slate-100 text-slate-700 border-slate-200";
}

export const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
