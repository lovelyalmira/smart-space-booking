"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Sofa, Tag, ClipboardList, Wallet, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageLoading } from "@/components/shared/loading";
import { adminMemberService } from "@/services/member.service";
import { adminService } from "@/services/admin.service";
import { adminReservationService } from "@/services/admin-reservation.service";
import { formatCurrency, formatDate, spaceTypeLabel } from "@/lib/format";
import { getUser } from "@/lib/auth";

export default function AdminDashboard() {
  const [name, setName] = useState("Admin");
  useEffect(() => { setName(getUser()?.space_owner?.nama_coworking || getUser()?.username || "Admin"); }, []);

  const { data: members = [] } = useQuery({ queryKey: ["admin-members"], queryFn: () => adminMemberService.list() });
  const { data: spaces = [] } = useQuery({ queryKey: ["admin-spaces"], queryFn: () => adminService.spaces() });
  const { data: discounts = [] } = useQuery({ queryKey: ["admin-discounts"], queryFn: () => adminService.discounts() });
  const { data: reservations = [], isLoading } = useQuery({ queryKey: ["admin-reservations"], queryFn: () => adminReservationService.list() });

  const revenue = reservations
    .filter((r) => ["disetujui", "aktif", "selesai"].includes(r.status))
    .reduce((sum, r) => sum + (r.detail_reservasi?.[0]?.total_harga || 0), 0);
  const recent = [...reservations].slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Selamat datang, {name}</h1>
        <p className="mt-1 text-slate-500">Ringkasan aktivitas coworking space Anda.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Members" value={members.length} accent="bg-indigo-100 text-indigo-600" />
        <StatCard icon={Sofa} label="Total Spaces" value={spaces.length} accent="bg-blue-100 text-blue-600" />
        <StatCard icon={Tag} label="Total Promo" value={discounts.length} accent="bg-rose-100 text-rose-600" />
        <StatCard icon={ClipboardList} label="Total Reservasi" value={reservations.length} accent="bg-amber-100 text-amber-600" />
        <StatCard icon={Wallet} label="Total Pendapatan" value={formatCurrency(revenue)} accent="bg-emerald-100 text-emerald-600" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Reservasi Terbaru</h2>
          <Link href="/admin/reservations" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">Kelola <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {isLoading ? <PageLoading /> : recent.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/50 py-10 text-center text-sm text-muted-foreground">Belum ada reservasi.</div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Booking</th><th className="p-3">Member</th><th className="p-3">Space</th><th className="p-3">Tanggal</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">CWK-{String(r.id).padStart(6, "0")}</td>
                    <td className="p-3">{r.member?.nama_member || "-"}</td>
                    <td className="p-3">{r.detail_reservasi?.[0]?.space?.nama_space || "-"}<span className="ml-1 text-xs text-slate-400">({spaceTypeLabel(r.detail_reservasi?.[0]?.space?.tipe)})</span></td>
                    <td className="p-3">{formatDate(r.tanggal_reservasi)}</td>
                    <td className="p-3 font-medium">{formatCurrency(r.detail_reservasi?.[0]?.total_harga)}</td>
                    <td className="p-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
