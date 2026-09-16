"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Printer, Sparkles, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { reservationService } from "@/services/reservation.service";
import { formatCurrency, formatDateLong } from "@/lib/format";

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function ETicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: t, isLoading, isError } = useQuery({ queryKey: ["eticket", id], queryFn: () => reservationService.eTicket(id) });

  if (isLoading) return <PageLoading label="Menyiapkan e-ticket..." />;
  if (isError || !t) return <EmptyState title="E-Ticket tidak tersedia" />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-5 flex items-center justify-between">
        <Link href={`/member/reservations/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
        <Button onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" /> Print E-Ticket</Button>
      </div>

      <div className="print-area overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-indigo-700 p-6 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20"><Sparkles className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-bold">{t.coworking_space?.nama}</p>
              <p className="text-[11px] text-indigo-100">{t.ticket_title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-indigo-100">Booking Code</p>
            <p className="font-mono text-lg font-bold">{t.booking_code}</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <Info label="Member" value={t.member?.nama} />
              <Info label="Instansi" value={t.member?.instansi} />
              <Info label="Telepon" value={t.member?.telp} />
              <Info label="Status" value={<StatusBadge status={t.status} />} />
              <Info label="Space" value={t.space?.nama} />
              <Info label="Tipe" value={t.space?.tipe} />
              <Info label="Kapasitas" value={t.space?.kapasitas} />
              <Info label="Tanggal" value={formatDateLong(t.jadwal?.tanggal)} />
              <Info label="Jam Mulai" value={t.jadwal?.jam_mulai} />
              <Info label="Durasi" value={t.jadwal?.durasi} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-4">
            <QRCodeSVG value={t.qr_code_data || t.booking_code} size={140} level="M" />
            <p className="mt-3 text-center text-[11px] text-slate-500">Scan saat check-in</p>
          </div>
        </div>

        {/* biaya */}
        <div className="border-t border-dashed p-6">
          <p className="mb-3 text-sm font-semibold text-slate-700">Rincian Biaya</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Harga / jam</span><span>{formatCurrency(t.rincian_biaya?.harga_per_jam)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Durasi</span><span>{t.rincian_biaya?.durasi_jam} jam</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(t.rincian_biaya?.subtotal)}</span></div>
            {t.rincian_biaya?.diskon_nama && (
              <div className="flex justify-between text-emerald-600"><span>Diskon ({t.rincian_biaya?.diskon_persen}) · {t.rincian_biaya?.diskon_nama}</span><span>- {formatCurrency((t.rincian_biaya?.subtotal || 0) - (t.rincian_biaya?.total_pembayaran || 0))}</span></div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total Dibayar</span><span className="text-primary">{formatCurrency(t.rincian_biaya?.total_pembayaran)}</span></div>
          </div>
        </div>

        <div className="border-t bg-slate-50 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Instruksi Check-in</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
            {(t.instruksi_check_in || []).map((ins, i) => <li key={i}>{ins}</li>)}
          </ul>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {t.coworking_space?.nama}</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {t.coworking_space?.telp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
