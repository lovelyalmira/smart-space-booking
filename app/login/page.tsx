"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { saveSession, homePathForRole } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";
import { AuthUser } from "@/types";
import { HERO_IMAGE } from "@/lib/space-images";

const schema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = await authService.login(values.username, values.password);
      const user: AuthUser = {
        id: data.member?.id_user || data.space_owner?.id || 0,
        username: values.username,
        role: data.role,
        member: data.member || null,
        space_owner: data.space_owner || null,
      };
      saveSession(data.access_token, data.role, user);
      toast.success("Login berhasil! Selamat datang kembali.");
      const redirect = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
      router.replace(redirect && redirect.startsWith("/" + data.role.split("_")[0]) ? redirect : homePathForRole(data.role));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:block">
        <img src={HERO_IMAGE} alt="Coworking" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-indigo-900/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20"><Sparkles className="h-5 w-5" /></div>
            <span className="text-lg font-bold">Smart Space Booking</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Ruang kerja terbaik, <br />satu klik saja.</h2>
            <p className="mt-4 max-w-md text-indigo-100">Masuk untuk mengelola reservasi, menjelajahi space, dan menikmati promo eksklusif.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Kembali ke beranda</Link>
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Selamat Datang</h1>
            <p className="mt-1 text-sm text-slate-500">Masuk ke akun Smart Space Booking Anda.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Masukkan username" {...register("username")} />
                {errors.username && <p className="text-xs text-rose-600">{errors.username.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? "text" : "password"} placeholder="Masukkan password" {...register("password")} />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Login
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun? <Link href="/register" className="font-semibold text-primary hover:underline">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
