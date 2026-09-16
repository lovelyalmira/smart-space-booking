"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle, LogIn, LogOut, Loader2, ClipboardList, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { adminReservationService, AdminReservationFilter } from "@/services/admin-reservation.service";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate, formatDateLong, endTime, spaceTypeLabel, MONTHS } from "@/lib/format";
import { Reservation } from "@/types";

const now = new Date();
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
const STATUSES = [
  { value: "belum_dikonfirm", label: "Belum Dikonfirmasi" },
  { value: "disetujui", label: "Disetujui" },
  { value: "aktif", label: "Aktif / Digunakan" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];
const ALL = "all";

export default function AdminReservationsPage() {
  const qc = useQueryClient();
  const [month, setMonth] = useState<string>(ALL);
  const [year, setYear] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [idSpace, setIdSpace] = useState<string>(ALL);
  const [tanggal, setTanggal] = useState("");
  const [detail, setDetail] = useState<Reservation | null>(null);

  const filter: AdminReservationFilter = {
    month: month !== ALL ? Number(month) : undefined,
    year: year !== ALL ? Number(year) : undefined,
    status: status !== ALL ? status : undefined,
    id_space: idSpace !== ALL ? Number(idSpace) : undefined,
    tanggal: tanggal || undefined,
  };

  const { data: spaces = [] } = useQuery({ queryKey: ["admin-spaces"], queryFn: () => adminService.spaces() });
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin-reservations", filter], queryFn: () => adminReservationService.list(filter) });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-reservations"] });

  const [busyId, setBusyId] = useState<number | null>(null);
  const act = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: string }) => {
      setBusyId(id);
      if (action === "check-in") return adminReservationService.checkIn(id);
      if (action === "check-out") return adminReservationService.checkOut(id);
      return adminReservationService.updateStatus(id, action);
    },
    onSuccess: () => { toast.success("Status reservasi diperbarui."); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
    onSettled: () => setBusyId(null),
  });

  const resetFilter = () => { setMonth(ALL); setYear(ALL); setStatus(ALL); setIdSpace(ALL); setTanggal(""); };

  const renderActions = (r: Reservation) => {
    const loading = busyId === r.id && act.isPending;
    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    const btns: React.ReactNode[] = [
      <Button key="v" size="icon" variant="ghost" onClick={() => setDetail(r)}><Eye className="h-4 w-4" /></Button>,
    ];
    if (r.status === "belum_dikonfirm") {
      btns.push(<Button key="a" size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700" onClick={() => act.mutate({ id: r.id, action: "disetujui" })}><CheckCircle2 className="h-3.5 w-3.5" /> Approve</Button>);
      btns.push(<Button key="c" size="sm" variant="outline" className="gap-1 text-rose-600" onClick={() => act.mutate({ id: r.id, action: "dibatalkan" })}><XCircle className="h-3.5 w-3.5" /> Cancel</Button>);
    } else if (r.status === "disetujui") {
      btns.push(<Button key="in" size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => act.mutate({ id: r.id, action: "check-in" })}><LogIn className="h-3.5 w-3.5" /> Check-In</Button>);
      btns.push(<Button key="c" size="sm" variant="outline" className="gap-1 text-rose-600" onClick={() => act.mutate({ id: r.id, action: "dibatalkan" })}><XCircle className="h-3.5 w-3.5" /> Cancel</Button>);
    } else if (r.status === "aktif") {
      btns.push(<Button key="out" size="sm" className="gap-1 bg-slate-700 hover:bg-slate-800" onClick={() => act.mutate({ id: r.id, action: "check-out" })}><LogOut className="h-3.5 w-3.5" /> Check-Out</Button>);
    }
    return <div className="flex items-center justify-end gap-1">{btns}</div>;
  };

  return (
    <div>
      <PageHeader title="Reservations" description="Kelola seluruh reservasi coworking space." />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Select value={month} onValueChange={setMonth}><SelectTrigger className="w-36"><SelectValue placeholder="Bulan" /></SelectTrigger><SelectContent><SelectItem value={ALL}>Semua Bulan</SelectItem>{MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent></Select>
        <Select value={year} onValueChange={setYear}><SelectTrigger className="w-32"><SelectValue placeholder="Tahun" /></SelectTrigger><SelectContent><SelectItem value={ALL}>Semua Tahun</SelectItem>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value={ALL}>Semua Status</SelectItem>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
        <Select value={idSpace} onValueChange={setIdSpace}><SelectTrigger className="w-44"><SelectValue placeholder="Space" /></SelectTrigger><SelectContent><SelectItem value={ALL}>Semua Space</SelectItem>{spaces.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_space}</SelectItem>)}</SelectContent></Select>
        <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-40" />
        <Button variant="ghost" onClick={resetFilter} className="gap-1 text-slate-500"><Filter className="h-4 w-4" /> Reset</Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        {isLoading ? <div className="p-4"><TableSkeleton cols={7} /></div> : rows.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Tidak ada reservasi" description="Belum ada reservasi sesuai filter yang dipilih." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Booking</th><th className="p-3">Member</th><th className="p-3">Space</th><th className="p-3">Tanggal</th><th className="p-3">Jam</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">CWK-{String(r.id).padStart(6, "0")}</td>
                    <td className="p-3 font-medium text-slate-900">{r.member?.nama_member || "-"}</td>
                    <td className="p-3">{r.detail_reservasi?.[0]?.space?.nama_space || "-"}</td>
                    <td className="p-3">{formatDate(r.tanggal_reservasi)}</td>
                    <td className="p-3">{r.jam_mulai}-{endTime(r.jam_mulai, r.durasi_jam)}</td>
                    <td className="p-3 font-medium">{formatCurrency(r.detail_reservasi?.[0]?.total_harga)}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                    <td className="p-3">{renderActions(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detail Reservasi</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Booking Code</span><span className="font-mono font-medium">CWK-{String(detail.id).padStart(6, "0")}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Member</span><span className="font-medium">{detail.member?.nama_member}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Instansi</span><span>{detail.member?.instansi}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Telepon</span><span>{detail.member?.telp}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Space</span><span className="font-medium">{detail.detail_reservasi?.[0]?.space?.nama_space} ({spaceTypeLabel(detail.detail_reservasi?.[0]?.space?.tipe)})</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span>{formatDateLong(detail.tanggal_reservasi)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Jam</span><span>{detail.jam_mulai} - {endTime(detail.jam_mulai, detail.durasi_jam)} ({detail.durasi_jam} jam)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total</span><span className="font-bold text-primary">{formatCurrency(detail.detail_reservasi?.[0]?.total_harga)}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Status</span><StatusBadge status={detail.status} /></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
