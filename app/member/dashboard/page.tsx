"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Compass, CalendarCheck, Clock, Tag, ArrowRight, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CardSkeletonGrid, PageLoading } from "@/components/shared/loading";
import { spaceService } from "@/services/space.service";
import { reservationService } from "@/services/reservation.service";
import { discountService } from "@/services/discount.service";
import { spaceImage } from "@/lib/space-images";
import { formatCurrency, spaceTypeLabel, formatDate, formatDate as fd } from "@/lib/format";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function MemberDashboard() {
  const [name, setName] = useState("Member");
  useEffect(() => { setName(getUser()?.member?.nama_member || getUser()?.username || "Member"); }, []);

  const { data: spaces = [], isLoading: loadingSpaces } = useQuery({ queryKey: ["spaces"], queryFn: () => spaceService.list() });
  const { data: myRes = [], isLoading: loadingRes } = useQuery({ queryKey: ["my-reservations"], queryFn: () => reservationService.my() });
  const { data: promos = [] } = useQuery({ queryKey: ["active-promos"], queryFn: () => discountService.active() });

  const active = myRes.filter((r) => ["disetujui", "aktif"].includes(r.status));
  const upcoming = myRes.filter((r) => r.status === "belum_dikonfirm");

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-700 p-6 text-white sm:p-8">
        <h1 className="text-2xl font-bold">Halo, {name}! 👋</h1>
        <p className="mt-1 max-w-lg text-indigo-100">Temukan ruang kerja terbaik dan buat reservasi dengan mudah hari ini.</p>
        <Link href="/member/spaces"><Button variant="secondary" className="mt-5 gap-2">Explore Space <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Compass} label="Available Spaces" value={spaces.length} accent="bg-indigo-100 text-indigo-600" />
        <StatCard icon={CalendarCheck} label="Total Reservasi" value={myRes.length} accent="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Clock} label="Menunggu Konfirmasi" value={upcoming.length} accent="bg-amber-100 text-amber-600" />
        <StatCard icon={Tag} label="Promo Aktif" value={promos.length} accent="bg-rose-100 text-rose-600" />
      </div>

      {/* Active reservations */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Reservasi Aktif & Menunggu</h2>
          <Link href="/member/reservations" className="text-sm font-medium text-primary hover:underline">Lihat semua</Link>
        </div>
        {loadingRes ? <PageLoading /> : (active.length + upcoming.length) === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/50 py-10 text-center text-sm text-muted-foreground">Belum ada reservasi aktif. Yuk mulai pesan ruang!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {[...active, ...upcoming].slice(0, 4).map((r) => {
              const sp = r.detail_reservasi?.[0]?.space;
              return (
                <Link key={r.id} href={`/member/reservations/${r.id}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:shadow-md">
                  <img src={spaceImage(sp)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{sp?.nama_space || "Space"}</p>
                    <p className="text-xs text-slate-500">{formatDate(r.tanggal_reservasi)} · {r.jam_mulai} · {r.durasi_jam} jam</p>
                    <div className="mt-2"><StatusBadge status={r.status} /></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Available spaces */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Ruang Tersedia</h2>
          <Link href="/member/spaces" className="text-sm font-medium text-primary hover:underline">Lihat semua</Link>
        </div>
        {loadingSpaces ? <CardSkeletonGrid count={3} /> : spaces.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/50 py-10 text-center text-sm text-muted-foreground">Belum ada space tersedia.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.slice(0, 3).map((s) => (
              <div key={s.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <img src={spaceImage(s)} alt={s.nama_space} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{spaceTypeLabel(s.tipe)}</span>
                    <span className="text-sm font-bold text-primary">{formatCurrency(s.harga_per_jam)}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-slate-900">{s.nama_space}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.kapasitas}</span>
                    {s.owner?.nama_coworking && <span className="flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5" /> {s.owner.nama_coworking}</span>}
                  </div>
                  <Link href={`/member/spaces/${s.id}`}><Button className="mt-3 w-full" size="sm">Detail & Reservasi</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo */}
      {promos.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Promo untuk Anda</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((p) => (
              <div key={p.id} className="rounded-xl border-2 border-dashed border-primary/30 bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary px-2.5 py-1 font-bold text-primary-foreground">{p.persentase_diskon}% OFF</span>
                  <Tag className="h-5 w-5 text-primary/40" />
                </div>
                <p className="mt-3 font-bold tracking-wide text-slate-900">{p.nama_diskon}</p>
                <p className="text-xs text-slate-500">Berlaku s/d {fd(p.tanggal_akhir)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
