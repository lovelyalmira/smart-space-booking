"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Building2, MapPin, Phone, AtSign } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/auth.service";

function Field({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 font-medium text-slate-900">{value || "-"}</p>
      </div>
    </div>
  );
}

export default function MemberProfilePage() {
  const { data: user, isLoading } = useQuery({ queryKey: ["profile"], queryFn: () => authService.profile() });
  if (isLoading) return <PageLoading />;
  const m = user?.member;
  const name = m?.nama_member || user?.username || "Member";

  return (
    <div>
      <PageHeader title="Profile" description="Informasi akun member Anda." />
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{name}</h2>
            <p className="text-sm text-slate-500">@{user?.username}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="Nama Lengkap" value={m?.nama_member} />
          <Field icon={AtSign} label="Username" value={user?.username} />
          <Field icon={Building2} label="Instansi" value={m?.instansi} />
          <Field icon={Phone} label="Telepon" value={m?.telp} />
          <div className="sm:col-span-2"><Field icon={MapPin} label="Alamat" value={m?.alamat} /></div>
        </div>
      </div>
    </div>
  );
}
