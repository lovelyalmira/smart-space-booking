"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Loader2, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ImageUpload } from "@/components/shared/image-upload";
import { adminMemberService, MemberPayload } from "@/services/member.service";
import { getApiErrorMessage } from "@/lib/api";
import { getImageUrl } from "@/lib/image";
import { Member } from "@/types";

interface FormShape extends MemberPayload { }

export default function AdminMembersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [foto, setFoto] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: members = [], isLoading } = useQuery({ queryKey: ["admin-members", q], queryFn: () => adminMemberService.list({ search: q || undefined }) });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormShape>();

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-members"] }); };

  const saveMutation = useMutation({
    mutationFn: (values: FormShape) => {
      const payload = { ...values, foto: foto || undefined };
      return editing ? adminMemberService.update(editing.id, payload) : adminMemberService.create(payload);
    },
    onSuccess: () => { toast.success(editing ? "Member diperbarui." : "Member ditambahkan."); setOpen(false); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminMemberService.remove(id),
    onSuccess: () => { toast.success("Member dihapus."); setDeleteId(null); invalidate(); },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const openCreate = () => { setEditing(null); setFoto(""); reset({ username: "", password: "", nama_member: "", instansi: "", alamat: "", telp: "" }); setOpen(true); };
  const openEdit = (m: Member) => { setEditing(m); setFoto(m.foto_url || m.foto || ""); reset({ nama_member: m.nama_member, instansi: m.instansi, alamat: m.alamat, telp: m.telp }); setOpen(true); };

  return (
    <div>
      <PageHeader title="Members" description="Kelola data member coworking space." action={<Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Tambah Member</Button>} />

      <form onSubmit={(e) => { e.preventDefault(); setQ(search); }} className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari member..." className="pl-9" />
      </form>

      <div className="overflow-hidden rounded-xl border bg-card">
        {isLoading ? <div className="p-4"><TableSkeleton /></div> : members.length === 0 ? (
          <EmptyState icon={Users} title="Belum ada member" description="Tambahkan member pertama Anda." actionLabel="Tambah Member" onAction={openCreate} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-3">Foto</th><th className="p-3">Nama</th><th className="p-3">Username</th><th className="p-3">Instansi</th><th className="p-3">Telepon</th><th className="p-3 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3"><Avatar className="h-10 w-10"><AvatarImage src={getImageUrl(m.foto_url, m.foto, "")} /><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{m.nama_member.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar></td>
                    <td className="p-3 font-medium text-slate-900">{m.nama_member}</td>
                    <td className="p-3 text-slate-500">@{m.user?.username}</td>
                    <td className="p-3">{m.instansi}</td>
                    <td className="p-3">{m.telp}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-rose-600" onClick={() => setDeleteId(m.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Tambah Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
            <div className="space-y-1.5"><Label>Foto Profil</Label><ImageUpload kind="member" value={foto} onChange={setFoto} /></div>
            {!editing && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Username</Label><Input {...register("username", { required: !editing })} />{errors.username && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" {...register("password", { required: !editing, minLength: 6 })} />{errors.password && <p className="text-xs text-rose-600">Min. 6 karakter</p>}</div>
              </div>
            )}
            <div className="space-y-1.5"><Label>Nama Lengkap</Label><Input {...register("nama_member", { required: true })} />{errors.nama_member && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Instansi</Label><Input {...register("instansi", { required: true })} />{errors.instansi && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
              <div className="space-y-1.5"><Label>Telepon</Label><Input {...register("telp", { required: true })} />{errors.telp && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            </div>
            <div className="space-y-1.5"><Label>Alamat</Label><Textarea {...register("alamat", { required: true })} />{errors.alamat && <p className="text-xs text-rose-600">Wajib diisi</p>}</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="gap-2">{saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus Member?</AlertDialogTitle><AlertDialogDescription>Data member akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>{deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
