"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/api";

const schema = z.object({
  nama_coworking: z.string().min(1, "Nama coworking wajib diisi"),
  nama_pemilik: z.string().min(1, "Nama pemilik wajib diisi"),
  telp: z.string().min(1, "Nomor telepon wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-profile"], queryFn: () => adminService.getProfile() });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) reset({ nama_coworking: data.nama_coworking, nama_pemilik: data.nama_pemilik, telp: data.telp });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (v: FormValues) => adminService.updateProfile(v),
    onSuccess: () => { toast.success("Profil coworking berhasil diperbarui."); qc.invalidateQueries({ queryKey: ["admin-profile"] }); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <PageLoading />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Coworking Profile" description="Kelola informasi coworking space Anda." />
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></div>
          <div>
            <p className="font-semibold text-slate-900">{data?.nama_coworking}</p>
            <p className="text-sm text-slate-500">@{data?.user?.username}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5"><Label>Nama Coworking</Label><Input {...register("nama_coworking")} />{errors.nama_coworking && <p className="text-xs text-rose-600">{errors.nama_coworking.message}</p>}</div>
          <div className="space-y-1.5"><Label>Nama Pemilik</Label><Input {...register("nama_pemilik")} />{errors.nama_pemilik && <p className="text-xs text-rose-600">{errors.nama_pemilik.message}</p>}</div>
          <div className="space-y-1.5"><Label>Nomor Telepon</Label><Input {...register("telp")} />{errors.telp && <p className="text-xs text-rose-600">{errors.telp.message}</p>}</div>
          <Button type="submit" disabled={mutation.isPending} className="gap-2">{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Perubahan</Button>
        </form>
      </div>
    </div>
  );
}
