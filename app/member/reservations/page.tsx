"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Eye, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { reservationService } from "@/services/reservation.service";
import { spaceImage } from "@/lib/space-images";
import { formatCurrency, formatDate, endTime } from "@/lib/format";

export default function MyReservationsPage() {
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["my-reservations"], queryFn: () => reservationService.my() });

  return (
    <div>
      <PageHeader title="My Reservations" description="Daftar seluruh reservasi Anda." />
      {isLoading ? <PageLoading /> : rows.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="Belum ada reservasi" description="Anda belum membuat reservasi. Jelajahi ruang dan pesan sekarang." actionLabel="Explore Space" onAction={() => (window.location.href = "/member/spaces")} />
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const sp = r.detail_reservasi?.[0]?.space;
            const total = r.detail_reservasi?.[0]?.total_harga;
            const code = `CWK-${String(r.id).padStart(6, "0")}`;
            return (
              <div key={r.id} className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
                <img src={spaceImage(sp)} alt="" className="h-24 w-full rounded-lg object-cover sm:h-20 sm:w-28" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{code}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 truncate font-semibold text-slate-900">{sp?.nama_space || "Space"}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{formatDate(r.tanggal_reservasi)}</span>
                    <span>{r.jam_mulai} - {endTime(r.jam_mulai, r.durasi_jam)}</span>
                    <span>{r.durasi_jam} jam</span>
                    {sp && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {sp.kapasitas}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <span className="font-bold text-primary">{formatCurrency(total)}</span>
                  <div className="flex gap-2">
                    <Link href={`/member/reservations/${r.id}`}><Button size="sm" variant="outline" className="gap-1"><Eye className="h-3.5 w-3.5" /> Detail</Button></Link>
                    <Link href={`/member/reservations/${r.id}/e-ticket`}><Button size="sm" className="gap-1"><Ticket className="h-3.5 w-3.5" /> E-Ticket</Button></Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
