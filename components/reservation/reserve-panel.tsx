"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar, Clock, Timer, Tag, CheckCircle2, XCircle, Loader2, ShieldCheck, Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Space, DiscountCheckResult, AvailabilitySpace } from "@/types";
import { spaceService } from "@/services/space.service";
import { discountService } from "@/services/discount.service";
import { reservationService } from "@/services/reservation.service";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, endTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const TIMES = Array.from({ length: 16 }, (_, i) => `${String(6 + i).padStart(2, "0")}:00`);
const today = () => new Date().toISOString().slice(0, 10);

export function ReservePanel({ space }: { space: Space }) {
  const router = useRouter();
  const [tanggal, setTanggal] = useState(today());
  const [jamMulai, setJamMulai] = useState("09:00");
  const [durasi, setDurasi] = useState(1);
  const [avail, setAvail] = useState<AvailabilitySpace | null>(null);
  const [checkedKey, setCheckedKey] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState<DiscountCheckResult | null>(null);

  const currentKey = `${tanggal}|${jamMulai}|${durasi}`;
  const availabilityValid = checkedKey === currentKey && avail?.is_available;

  const resetAvail = () => { setAvail(null); setCheckedKey(""); };

  const checkMutation = useMutation({
    mutationFn: () => spaceService.availability({ id_space: space.id, tanggal, jam_mulai: jamMulai, durasi_jam: durasi }),
    onSuccess: (rows) => {
      const row = rows.find((r) => r.id === space.id) || rows[0];
      setAvail(row || null);
      setCheckedKey(currentKey);
      if (row?.is_available) toast.success("Space tersedia pada jadwal ini!");
      else toast.error("Space tidak tersedia pada jadwal tersebut.");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const promoMutation = useMutation({
    mutationFn: () => discountService.check(promoCode.trim()),
    onSuccess: (res) => {
      if (res.valid) { setPromo(res); toast.success(res.message || "Promo berhasil digunakan"); }
      else { setPromo(null); toast.error(res.message || "Promo tidak valid"); }
    },
    onError: (e) => { setPromo(null); toast.error(getApiErrorMessage(e)); },
  });

  const submitMutation = useMutation({
    mutationFn: () => reservationService.create({
      id_space: space.id,
      tanggal_reservasi: tanggal,
      jam_mulai: jamMulai,
      durasi_jam: durasi,
      ...(promo?.valid ? { id_diskon: promo.diskon.id, kode_promo: promo.diskon.nama_diskon } : {}),
    }),
    onSuccess: (res) => {
      toast.success("Reservasi berhasil dibuat!");
      router.push(`/member/reservations/${res.id}`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const subtotal = space.harga_per_jam * durasi;
  const persen = promo?.valid ? promo.diskon.persentase_diskon : 0;
  const discountAmt = Math.round((subtotal * persen) / 100);
  const total = subtotal - discountAmt;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-slate-900">Buat Reservasi</h3>
      </div>
      <p className="mt-1 text-sm text-slate-500">Cek ketersediaan sebelum melakukan reservasi.</p>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> Tanggal</Label>
          <Input type="date" min={today()} value={tanggal} onChange={(e) => { setTanggal(e.target.value); resetAvail(); }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> Jam Mulai</Label>
            <Select value={jamMulai} onValueChange={(v) => { setJamMulai(v); resetAvail(); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Timer className="h-4 w-4 text-slate-400" /> Durasi (jam)</Label>
            <Input type="number" min={1} max={12} value={durasi} onChange={(e) => { setDurasi(Math.max(1, Number(e.target.value) || 1)); resetAvail(); }} />
          </div>
        </div>
        <p className="text-xs text-slate-500">Selesai pada pukul <span className="font-semibold text-slate-700">{endTime(jamMulai, durasi)}</span></p>

        <Button variant="outline" className="w-full" onClick={() => checkMutation.mutate()} disabled={checkMutation.isPending}>
          {checkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Check Availability
        </Button>

        {checkedKey === currentKey && avail && (
          <div className={cn("flex items-center gap-2 rounded-lg border p-3 text-sm",
            avail.is_available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700")}>
            {avail.is_available ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {avail.is_available ? "Space tersedia pada jadwal ini." : "Space tidak tersedia pada tanggal & rentang jam tersebut."}
          </div>
        )}

        {/* Promo */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-slate-400" /> Kode Promo (opsional)</Label>
          <div className="flex gap-2">
            <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="cth: DISKONHEMAT20" />
            <Button variant="secondary" onClick={() => promoCode.trim() && promoMutation.mutate()} disabled={promoMutation.isPending}>
              {promoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cek"}
            </Button>
          </div>
          {promo?.valid && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Promo aktif — {promo.diskon.persentase_diskon}% OFF
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Harga / jam</span><span className="font-medium">{formatCurrency(space.harga_per_jam)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Durasi</span><span className="font-medium">{durasi} jam</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
          {discountAmt > 0 && <div className="flex justify-between text-emerald-600"><span>Diskon ({persen}%)</span><span className="font-medium">- {formatCurrency(discountAmt)}</span></div>}
          <div className="flex justify-between border-t pt-2 text-base font-bold text-slate-900"><span>Total</span><span className="text-primary">{formatCurrency(total)}</span></div>
        </div>

        <Button className="w-full gap-2" size="lg" onClick={() => submitMutation.mutate()} disabled={!availabilityValid || submitMutation.isPending}>
          {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {availabilityValid ? "Submit Reservasi" : "Cek ketersediaan dulu"}
        </Button>
      </div>
    </div>
  );
}
