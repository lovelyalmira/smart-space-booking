"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { History as HistoryIcon, Wallet, CalendarRange, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { reservationService } from "@/services/reservation.service";
import { formatCurrency, formatDate, MONTHS } from "@/lib/format";

const now = new Date();
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

export default function HistoryPage() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useQuery({
    queryKey: ["history", month, year],
    queryFn: () => reservationService.history(month, year),
  });

  const rows = data?.data || [];
  const totalSpending = rows.reduce((sum, r) => sum + (r.detail_reservasi?.[0]?.total_harga || 0), 0);

  return (
    <div>
      <PageHeader title="History" description="Riwayat reservasi berdasarkan bulan dan tahun." />

      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={CalendarRange} label="Total Reservasi" value={data?.total_reservasi ?? 0} accent="bg-indigo-100 text-indigo-600" />
        <StatCard icon={Wallet} label="Total Pengeluaran" value={formatCurrency(totalSpending)} accent="bg-emerald-100 text-emerald-600" />
      </div>

      {isLoading ? <PageLoading /> : rows.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Belum ada riwayat" description={`Tidak ada reservasi pada ${MONTHS[month - 1]} ${year}.`} />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const sp = r.detail_reservasi?.[0]?.space;
            const total = r.detail_reservasi?.[0]?.total_harga;
            return (
              <div key={r.id} className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">CWK-{String(r.id).padStart(6, "0")}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-1 truncate font-semibold text-slate-900">{sp?.nama_space || "Space"}</p>
                  <p className="text-xs text-slate-500">{formatDate(r.tanggal_reservasi)} · {r.jam_mulai} · {r.durasi_jam} jam</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{formatCurrency(total)}</span>
                  <Link href={`/member/reservations/${r.id}`}><Button size="sm" variant="outline" className="gap-1"><Eye className="h-3.5 w-3.5" /> Detail</Button></Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
