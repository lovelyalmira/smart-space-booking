"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Wallet, TrendingUp, CheckCircle2, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading";
import { StatCard } from "@/components/shared/stat-card";
import { reportService } from "@/services/report.service";
import { formatCurrency, spaceTypeLabel, MONTHS, statusLabel } from "@/lib/format";

const now = new Date();
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e"];

export default function AdminReportsPage() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useQuery({ queryKey: ["report-income", month, year], queryFn: () => reportService.income({ month, year }) });

  const typeData = Object.entries(data?.pendapatan_per_tipe_space || {}).map(([k, v]) => ({ name: spaceTypeLabel(k), income: v.total_income, count: v.count }));
  const trend = (data?.tren_harian || []).map((t) => ({ tanggal: t.tanggal.slice(8, 10), income: t.total_income, count: t.total_reservations }));
  const statusData = Object.entries(data?.ringkasan?.status_reservasi || {}).map(([k, v]) => ({ name: statusLabel(k), value: v }));

  return (
    <div>
      <PageHeader title="Reports" description="Laporan pendapatan dan distribusi reservasi." />

      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent></Select>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
      </div>

      {isLoading ? <PageLoading /> : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={ClipboardList} label="Total Reservasi" value={data?.ringkasan?.total_reservasi ?? 0} accent="bg-indigo-100 text-indigo-600" hint={`${data?.periode?.nama_bulan} ${data?.periode?.tahun}`} />
            <StatCard icon={TrendingUp} label="Estimasi Pendapatan" value={formatCurrency(data?.ringkasan?.estimasi_pendapatan_total)} accent="bg-amber-100 text-amber-600" />
            <StatCard icon={Wallet} label="Realisasi Pendapatan" value={formatCurrency(data?.ringkasan?.realisasi_pendapatan)} accent="bg-emerald-100 text-emerald-600" />
            <StatCard icon={CheckCircle2} label="Selesai" value={data?.ringkasan?.status_reservasi?.selesai ?? 0} accent="bg-slate-100 text-slate-600" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
              <h3 className="mb-4 font-semibold text-slate-900">Tren Pendapatan Harian</h3>
              {trend.length === 0 ? <p className="py-16 text-center text-sm text-slate-400">Belum ada data pada periode ini.</p> : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trend}>
                    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                    <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-slate-900">Distribusi Status</h3>
              {statusData.every((s) => s.value === 0) ? <p className="py-16 text-center text-sm text-slate-400">Belum ada data.</p> : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={statusData.filter((s) => s.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-900">Pendapatan per Tipe Space</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="income" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
