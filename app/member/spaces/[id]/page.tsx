"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Phone, Building2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { spaceService } from "@/services/space.service";
import { ReservePanel } from "@/components/reservation/reserve-panel";
import { spaceImage } from "@/lib/space-images";
import { formatCurrency, spaceTypeLabel } from "@/lib/format";

export default function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: space, isLoading, isError } = useQuery({
    queryKey: ["space", id],
    queryFn: () => spaceService.detail(id),
  });

  if (isLoading) return <PageLoading />;
  if (isError || !space) return <EmptyState title="Space tidak ditemukan" description="Data ruang tidak tersedia." />;

  return (
    <div>
      <Link href="/member/spaces" className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Kembali ke Explore</Link>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <img src={spaceImage(space)} alt={space.nama_space} className="aspect-video w-full rounded-2xl object-cover shadow-sm" />
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{spaceTypeLabel(space.tipe)}</span>
              <span className="flex items-center gap-1 text-sm text-slate-500"><Users className="h-4 w-4" /> Kapasitas {space.kapasitas} orang</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{space.nama_space}</h1>
            <p className="mt-1 text-lg font-bold text-primary">{formatCurrency(space.harga_per_jam)} <span className="text-sm font-normal text-slate-400">/ jam</span></p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Deskripsi & Fasilitas</h2>
              <p className="mt-2 leading-relaxed text-slate-700">{space.deskripsi || "Tidak ada deskripsi."}</p>
            </div>

            {space.owner && (
              <div className="mt-6 rounded-xl border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pengelola Coworking</h2>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /> {space.owner.nama_coworking}</p>
                  {space.owner.nama_pemilik && <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-slate-400" /> {space.owner.nama_pemilik}</p>}
                  {space.owner.telp && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {space.owner.telp}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20"><ReservePanel space={space} /></div>
        </div>
      </div>
    </div>
  );
}
