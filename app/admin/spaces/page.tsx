"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Sofa, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ImageUpload } from "@/components/shared/image-upload";
import { adminService, SpacePayload } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/api";
import { spaceImage } from "@/lib/space-images";
import { formatCurrency, spaceTypeLabel } from "@/lib/format";
import { Space } from "@/types";

const TYPES = [
  { value: "desk", label: "Personal Desk" },
  { value: "meeting_room", label: "Meeting Room" },
  { value: "private_office", label: "Private Office" },
];

export default function AdminSpacesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Space | null>(null);
  const [foto, setFoto] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: spaces = [], isLoading } = useQuery({ queryKey: ["admin-spaces"], queryFn: () => adminService.spaces() });
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<SpacePayload>();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-spaces"] });

  const saveMutation = useMutation({
    mutationFn: (values: SpacePayload) => {
      const payload = { ...values, kapasitas: Number(values.kapasitas), harga_per_jam: Number(values.harga_per_jam), foto: foto || undefined };
      return editing ? adminService.updateSpace(editing.id, payload) : adminService.createSpace(payload);
    },
    onSuccess: () => { toast.success(editing ? "Space diperbarui." : "Space ditambahkan."); setOpen(false); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.removeSpace(id),
    onSuccess: () => { toast.success("Space dihapus."); setDeleteId(null); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const openCreate = () => { setEditing(null); setFoto(""); reset({ nama_space: "", tipe: "desk", kapasitas: 1, harga_per_jam: 0, deskripsi: "" }); setOpen(true); };
  const openEdit = (s: Space) => { setEditing(s); setFoto(s.foto_url || s.foto || ""); reset({ nama_space: s.nama_space, tipe: s.tipe, kapasitas: s.kapasitas, harga_per_jam: s.harga_per_jam, deskripsi: s.deskripsi || "" }); setOpen(true); };

  return (
    <div>
      <PageHeader title="Spaces" description="Kelola ruang kerja coworking Anda." action={<Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah Space</Button>} />

      <div className="overflow-hidden rounded-xl border bg-card">
        {isLoading ? <div className="p-4"><TableSkeleton /></div> : spaces.length === 0 ? (
          <EmptyState icon={Sofa} title="Belum ada space" description="Tambahkan ruang kerja pertama Anda." actionLabel="Tambah Space" onAction={openCreate} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Foto</th><th className="p-3">Nama Space</th><th className="p-3">Tipe</th><th className="p-3">Kapasitas</th><th className="p-3">Harga / Jam</th><th className="p-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y">
                {spaces.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3"><img src={spaceImage(s)} alt="" className="h-12 w-16 rounded-md object-cover" /></td>
                    <td className="p-3 font-medium text-slate-900">{s.nama_space}</td>
                    <td className="p-3"><span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{spaceTypeLabel(s.tipe)}</span></td>
                    <td className="p-3"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-400" /> {s.kapasitas}</span></td>
                    <td className="p-3 font-medium text-primary">{formatCurrency(s.harga_per_jam)}</td>
                    <td className="p-3"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-rose-600" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Space" : "Tambah Space"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
            <div className="space-y-1.5"><Label>Foto Space</Label><ImageUpload kind="space" value={foto} onChange={setFoto} /></div>
            <div className="space-y-1.5"><Label>Nama Space</Label><Input {...register("nama_space", { required: true })} />{errors.nama_space && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tipe</Label>
                <Controller control={control} name="tipe" rules={{ required: true }} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                    <SelectContent>{TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5"><Label>Kapasitas</Label><Input type="number" min={1} {...register("kapasitas", { required: true, valueAsNumber: true })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Harga / Jam (Rp)</Label><Input type="number" min={0} {...register("harga_per_jam", { required: true, valueAsNumber: true })} /></div>
            <div className="space-y-1.5"><Label>Deskripsi / Fasilitas</Label><Textarea {...register("deskripsi")} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="gap-2">{saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Space?</AlertDialogTitle><AlertDialogDescription>Ruang ini akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>{deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
