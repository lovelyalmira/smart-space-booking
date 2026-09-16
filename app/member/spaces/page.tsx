"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { CardSkeletonGrid } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { spaceService } from "@/services/space.service";
import { spaceImage } from "@/lib/space-images";
import { formatCurrency, spaceTypeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "", label: "All" },
  { key: "desk", label: "Personal Desk" },
  { key: "meeting_room", label: "Meeting Room" },
  { key: "private_office", label: "Private Office" },
];

export default function ExploreSpaces() {
  const [tipe, setTipe] = useState("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ["spaces", tipe, q],
    queryFn: () => spaceService.list({ tipe: tipe || undefined, search: q || undefined }),
  });

  return (
    <div>
      <PageHeader title="Explore Space" description="Temukan dan pesan ruang kerja sesuai kebutuhan Anda." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={(e) => { e.preventDefault(); setQ(search); }} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama space atau fasilitas..." className="pl-9" />
        </form>
        <Button variant="outline" onClick={() => setQ(search)} className="gap-2"><Filter className="h-4 w-4" /> Cari</Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setTipe(f.key)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition",
              tipe === f.key ? "border-primary bg-primary text-primary-foreground" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <CardSkeletonGrid /> : spaces.length === 0 ? (
        <EmptyState icon={Search} title="Tidak ada space ditemukan" description="Coba ubah kata kunci pencarian atau filter tipe ruang." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((s) => (
            <div key={s.id} className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md">
              <div className="h-44 overflow-hidden">
                <img src={spaceImage(s)} alt={s.nama_space} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{spaceTypeLabel(s.tipe)}</span>
                  <span className="text-sm font-bold text-primary">{formatCurrency(s.harga_per_jam)}<span className="text-xs font-normal text-slate-400">/jam</span></span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{s.nama_space}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.kapasitas} orang</span>
                  {s.owner?.nama_coworking && <span className="flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5" /> {s.owner.nama_coworking}</span>}
                </div>
                {s.deskripsi && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{s.deskripsi}</p>}
                <div className="mt-4 flex gap-2">
                  <Link href={`/member/spaces/${s.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full">Detail</Button></Link>
                  <Link href={`/member/spaces/${s.id}`} className="flex-1"><Button size="sm" className="w-full">Reservasi</Button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
