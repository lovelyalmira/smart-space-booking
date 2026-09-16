// Central API + domain types for Smart Space Booking

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  status: boolean;
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}

export type Role = "member" | "admin_space";
export type SpaceTypeKey = "desk" | "meeting_room" | "private_office";
export type ReservationStatus =
  | "belum_dikonfirm"
  | "disetujui"
  | "aktif"
  | "selesai"
  | "dibatalkan";

export interface SpaceTypeInfo {
  tipe: SpaceTypeKey;
  label: string;
  deskripsi: string;
}

export interface Owner {
  id: number;
  nama_coworking: string;
  nama_pemilik?: string;
  telp?: string;
}

export interface Space {
  id: number;
  nama_space: string;
  harga_per_jam: number;
  tipe: SpaceTypeKey;
  kapasitas: number;
  foto: string | null;
  foto_url: string | null;
  deskripsi: string | null;
  id_owner: number;
  maker_id: number;
  owner?: Owner;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilitySpace extends Space {
  is_available: boolean;
  conflicts: unknown[];
}

export interface Discount {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  maker_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiscountCheckResult {
  valid: boolean;
  message: string;
  diskon: Discount;
}

export interface Member {
  id: number;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  id_user: number;
  foto: string | null;
  foto_url?: string | null;
  maker_id?: number;
  user?: { id: number; username: string; role: Role; created_at?: string };
  _count?: { reservasi: number };
  created_at?: string;
  updated_at?: string;
}

export interface DetailReservasi {
  id: number;
  id_reservasi: number;
  id_space: number;
  id_diskon: number | null;
  total_harga: number;
  space?: Space;
}

export interface Reservation {
  id: number;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  id_owner: number;
  id_member: number;
  status: ReservationStatus;
  maker_id?: number;
  owner?: Owner;
  member?: Member;
  detail_reservasi?: DetailReservasi[];
  created_at?: string;
  updated_at?: string;
}

export interface HistoryResult {
  filter_month: number;
  filter_year: number;
  total_reservasi: number;
  data: Reservation[];
}

export interface ETicket {
  ticket_title: string;
  booking_code: string;
  reservasi_id: number;
  status: ReservationStatus;
  status_label: string;
  created_at: string;
  member: { id: number; nama: string; instansi: string; telp: string; alamat: string };
  coworking_space: { nama: string; penanggung_jawab: string; telp: string };
  space: { nama: string; tipe: string; kapasitas: string; harga_per_jam: number };
  jadwal: { tanggal: string; jam_mulai: string; durasi: string };
  rincian_biaya: {
    harga_per_jam: number;
    durasi_jam: number;
    subtotal: number;
    diskon_nama: string | null;
    diskon_persen: string | null;
    total_pembayaran: number;
  };
  instruksi_check_in: string[];
  qr_code_data: string;
}

export interface CoworkingProfile {
  id: number;
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
  id_user: number;
  user?: { id: number; username: string; role: Role };
}

export interface ReportPeriode {
  bulan: number;
  nama_bulan: string;
  tahun: number;
}

export interface Report {
  periode: ReportPeriode;
  ringkasan: {
    total_reservasi: number;
    estimasi_pendapatan_total: number;
    realisasi_pendapatan: number;
    status_reservasi: Record<ReservationStatus, number>;
  };
  pendapatan_per_tipe_space: Record<string, { count: number; total_income: number }>;
  tren_harian: { tanggal: string; total_reservations: number; total_income: number }[];
}

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
  member?: Member | null;
  space_owner?: Owner | null;
}

export interface LoginResult {
  access_token: string;
  role: Role;
  member?: Member | null;
  space_owner?: Owner | null;
  id?: number;
  username?: string;
}
