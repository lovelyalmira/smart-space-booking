"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowLeft, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api";

const memberSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nama_member: z.string().min(1, "Nama lengkap wajib diisi"),
  instansi: z.string().min(1, "Instansi wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  telp: z.string().min(1, "Nomor telepon wajib diisi"),
});
const adminSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nama_coworking: z.string().min(1, "Nama coworking wajib diisi"),
  nama_pemilik: z.string().min(1, "Nama pemilik wajib diisi"),
  telp: z.string().min(1, "Nomor telepon wajib diisi"),
});
type MemberForm = z.infer<typeof memberSchema>;
type AdminForm = z.infer<typeof adminSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const mForm = useForm<MemberForm>({ resolver: zodResolver(memberSchema) });
  const aForm = useForm<AdminForm>({ resolver: zodResolver(adminSchema) });

  const submitMember = async (values: MemberForm) => {
    setLoading(true);
    try {
      await authService.registerMember(values);
      toast.success("Registrasi member berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally { setLoading(false); }
  };

  const submitAdmin = async (values: AdminForm) => {
    setLoading(true);
    try {
      await authService.registerAdmin(values);
      toast.success("Registrasi admin space berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally { setLoading(false); }
  };

  const fieldError = (msg?: string) => msg ? <p className="text-xs text-rose-600">{msg}</p> : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-2xl px-4">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Kembali ke beranda</Link>
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></div>
            <div><h1 className="text-xl font-bold text-slate-900">Buat Akun Baru</h1><p className="text-sm text-slate-500">Pilih jenis akun yang ingin didaftarkan.</p></div>
          </div>
          <Tabs defaultValue="member">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member" className="gap-2"><User className="h-4 w-4" /> Member</TabsTrigger>
              <TabsTrigger value="admin" className="gap-2"><Building2 className="h-4 w-4" /> Admin Space</TabsTrigger>
            </TabsList>

            <TabsContent value="member" className="mt-6">
              <form onSubmit={mForm.handleSubmit(submitMember)} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Username</Label><Input placeholder="username" {...mForm.register("username")} />{fieldError(mForm.formState.errors.username?.message)}</div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="min. 6 karakter" {...mForm.register("password")} />{fieldError(mForm.formState.errors.password?.message)}</div>
                <div className="space-y-1.5"><Label>Nama Lengkap</Label><Input placeholder="Nama lengkap" {...mForm.register("nama_member")} />{fieldError(mForm.formState.errors.nama_member?.message)}</div>
                <div className="space-y-1.5"><Label>Instansi</Label><Input placeholder="Instansi / perusahaan" {...mForm.register("instansi")} />{fieldError(mForm.formState.errors.instansi?.message)}</div>
                <div className="space-y-1.5"><Label>Nomor Telepon</Label><Input placeholder="08xxxxxxxxxx" {...mForm.register("telp")} />{fieldError(mForm.formState.errors.telp?.message)}</div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Alamat</Label><Textarea placeholder="Alamat lengkap" {...mForm.register("alamat")} />{fieldError(mForm.formState.errors.alamat?.message)}</div>
                <div className="sm:col-span-2"><Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Daftar sebagai Member</Button></div>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <form onSubmit={aForm.handleSubmit(submitAdmin)} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Username</Label><Input placeholder="username" {...aForm.register("username")} />{fieldError(aForm.formState.errors.username?.message)}</div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="min. 6 karakter" {...aForm.register("password")} />{fieldError(aForm.formState.errors.password?.message)}</div>
                <div className="space-y-1.5"><Label>Nama Coworking</Label><Input placeholder="Nama coworking space" {...aForm.register("nama_coworking")} />{fieldError(aForm.formState.errors.nama_coworking?.message)}</div>
                <div className="space-y-1.5"><Label>Nama Pemilik</Label><Input placeholder="Nama pemilik" {...aForm.register("nama_pemilik")} />{fieldError(aForm.formState.errors.nama_pemilik?.message)}</div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Nomor Telepon</Label><Input placeholder="08xxxxxxxxxx" {...aForm.register("telp")} />{fieldError(aForm.formState.errors.telp?.message)}</div>
                <div className="sm:col-span-2"><Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Daftar sebagai Admin Space</Button></div>
              </form>
            </TabsContent>
          </Tabs>
          <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link href="/login" className="font-semibold text-primary hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
