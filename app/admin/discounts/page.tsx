"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { adminService, DiscountPayload } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/api";
import { formatDate, toInputDate } from "@/lib/format";
import { Discount } from "@/types";

function isActive(d: Discount) {
  const now = new Date();
  return new Date(d.tanggal_awal) <= now && now <= new Date(d.tanggal_akhir);
}

export default function AdminDiscountsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin-discounts"], queryFn: () => adminService.discounts() });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DiscountPayload>();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-discounts"] });

  const saveMutation = useMutation({
    mutationFn: (values: DiscountPayload) => {
      const payload = { ...values, persentase_diskon: Number(values.persentase_diskon) };
      return editing ? adminService.updateDiscount(editing.id, payload) : adminService.createDiscount(payload);
    },
    onSuccess: () => { toast.success(editing ? "Promo diperbarui." : "Promo ditambahkan."); setOpen(false); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.removeDiscount(id),
    onSuccess: () => { toast.success("Promo dihapus."); setDeleteId(null); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const openCreate = () => { setEditing(null); reset({ nama_diskon: "", persentase_diskon: 10, tanggal_awal: "", tanggal_akhir: "" }); setOpen(true); };
  const openEdit = (d: Discount) => { setEditing(d); reset({ nama_diskon: d.nama_diskon, persentase_diskon: d.persentase_diskon, tanggal_awal: toInputDate(d.tanggal_awal), tanggal_akhir: toInputDate(d.tanggal_akhir) }); setOpen(true); };

  return (
    <div>
      <PageHeader title="Promotions" description="Kelola kode promo & diskon." action={<Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah Promo</Button>} />

      <div className="overflow-hidden rounded-xl border bg-card">
        {isLoading ? <div className="p-4"><TableSkeleton /></div> : rows.length === 0 ? (
          <EmptyState icon={Tag} title="Belum ada promo" description="Tambahkan kode promo pertama Anda." actionLabel="Tambah Promo" onAction={openCreate} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Kode</th><th className="p-3">Diskon</th><th className="p-3">Mulai</th><th className="p-3">Akhir</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-medium text-slate-900">{d.nama_diskon}</td>
                    <td className="p-3"><span className="rounded-lg bg-primary/10 px-2 py-0.5 font-bold text-primary">{d.persentase_diskon}%</span></td>
                    <td className="p-3">{formatDate(d.tanggal_awal)}</td>
                    <td className="p-3">{formatDate(d.tanggal_akhir)}</td>
                    <td className="p-3">{isActive(d) ? <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Aktif</span> : <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Nonaktif</span>}</td>
                    <td className="p-3"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-rose-600" onClick={() => setDeleteId(d.id)}><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Promo" : "Tambah Promo"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
            <div className="space-y-1.5"><Label>Nama / Kode Diskon</Label><Input placeholder="cth: DISKONHEMAT20" {...register("nama_diskon", { required: true })} />{errors.nama_diskon && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            <div className="space-y-1.5"><Label>Persentase Diskon (1 - 100)</Label><Input type="number" min={1} max={100} {...register("persentase_diskon", { required: true, valueAsNumber: true, min: 1, max: 100 })} />{errors.persentase_diskon && <p className="text-xs text-rose-600">Nilai harus antara 1 - 100</p>}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Tanggal Mulai</Label><Input type="date" {...register("tanggal_awal", { required: true })} />{errors.tanggal_awal && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
              <div className="space-y-1.5"><Label>Tanggal Akhir</Label><Input type="date" {...register("tanggal_akhir", { required: true })} />{errors.tanggal_akhir && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="gap-2">{saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Promo?</AlertDialogTitle><AlertDialogDescription>Kode promo ini akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>{deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
