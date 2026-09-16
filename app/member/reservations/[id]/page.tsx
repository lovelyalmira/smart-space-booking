"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Ticket, Ban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { reservationService } from "@/services/reservation.service";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatDateLong, endTime, spaceTypeLabel } from "@/lib/format";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const { data: r, isLoading, isError } = useQuery({ queryKey: ["reservation", id], queryFn: () => reservationService.detail(id) });

  const cancelMutation = useMutation({
    mutationFn: () => reservationService.cancel(id),
    onSuccess: () => {
      toast.success("Reservasi berhasil dibatalkan.");
      qc.invalidateQueries({ queryKey: ["reservation", id] });
      qc.invalidateQueries({ queryKey: ["my-reservations"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <PageLoading />;
  if (isError || !r) return <EmptyState title="Reservasi tidak ditemukan" />;

  const detail = r.detail_reservasi?.[0];
  const sp = detail?.space;
  const total = detail?.total_harga ?? 0;
  const subtotal = (sp?.harga_per_jam ?? 0) * r.durasi_jam;
  const discount = Math.max(0, subtotal - total);
  const code = `CWK-${String(r.id).padStart(6, "0")}`;
  const canCancel = ["belum_dikonfirm", "disetujui"].includes(r.status);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/member/reservations" className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Kembali</Link>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b bg-emerald-50 p-5">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-lg font-bold text-slate-900">Reservasi Berhasil</h1>
            <p className="text-sm text-slate-500">Booking Code: <span className="font-mono font-semibold text-slate-700">{code}</span></p>
          </div>
          <div className="ml-auto"><StatusBadge status={r.status} /></div>
        </div>

        <div className="divide-y p-5">
          <Row label="Space" value={sp?.nama_space || "-"} />
          <Row label="Tipe" value={spaceTypeLabel(sp?.tipe)} />
          <Row label="Tanggal" value={formatDateLong(r.tanggal_reservasi)} />
          <Row label="Jam Mulai" value={r.jam_mulai} />
          <Row label="Jam Selesai" value={endTime(r.jam_mulai, r.durasi_jam)} />
          <Row label="Durasi" value={`${r.durasi_jam} jam`} />
          <Row label="Harga / Jam" value={formatCurrency(sp?.harga_per_jam)} />
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          {discount > 0 && <Row label="Diskon" value={<span className="text-emerald-600">- {formatCurrency(discount)}</span>} />}
          <div className="flex justify-between gap-4 py-3 text-base font-bold"><span>Total Pembayaran</span><span className="text-primary">{formatCurrency(total)}</span></div>
        </div>

        <div className="flex flex-col gap-2 border-t p-5 sm:flex-row">
          <Link href={`/member/reservations/${r.id}/e-ticket`} className="flex-1"><Button className="w-full gap-2"><Ticket className="h-4 w-4" /> Lihat E-Ticket</Button></Link>
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2 text-rose-600 hover:text-rose-700"><Ban className="h-4 w-4" /> Batalkan</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Batalkan Reservasi?</AlertDialogTitle>
                  <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Reservasi {code} akan dibatalkan.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Tidak</AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancelMutation.mutate()} className="bg-rose-600 hover:bg-rose-700">
                    {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ya, Batalkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
