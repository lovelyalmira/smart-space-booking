"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, ArrowRight, MapPin, Users, Clock, Wifi, ShieldCheck,
  CalendarCheck, QrCode, Search, Tag, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { spaceService } from "@/services/space.service";
import { discountService } from "@/services/discount.service";
import { spaceImage, HERO_IMAGE, SPACE_TYPE_IMAGE } from "@/lib/space-images";
import { formatCurrency, spaceTypeLabel, formatDate } from "@/lib/format";

const TYPES = [
  { key: "desk", label: "Personal Desk", desc: "Meja kerja individual dengan colokan, WiFi kencang, dan kenyamanan penuh." },
  { key: "meeting_room", label: "Meeting Room", desc: "Ruang rapat dengan proyektor/TV, whiteboard, sound system, dan AC." },
  { key: "private_office", label: "Private Office", desc: "Kantor privat eksklusif untuk tim dengan akses fleksibel & keamanan 24 jam." },
] as const;

export default function LandingPage() {
  const { data: spaces = [] } = useQuery({ queryKey: ["public-spaces"], queryFn: () => spaceService.list() });
  const { data: promos = [] } = useQuery({ queryKey: ["public-promos"], queryFn: () => discountService.active() });

  const featured = spaces.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-slate-900">Smart Space Booking</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#spaces" className="text-sm font-medium text-slate-600 hover:text-slate-900">Spaces</a>
            <a href="#types" className="text-sm font-medium text-slate-600 hover:text-slate-900">Categories</a>
            <a href="#how" className="text-sm font-medium text-slate-600 hover:text-slate-900">How It Works</a>
            <a href="#promo" className="text-sm font-medium text-slate-600 hover:text-slate-900">Promo</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Register</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Star className="h-3.5 w-3.5" /> Coworking Space Reservation Platform
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Pesan Ruang Kerja Impianmu<span className="text-primary"> dalam Hitungan Menit</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600">
              Smart Space Booking memudahkan kamu menemukan, mengecek ketersediaan, dan memesan personal desk, meeting room, hingga private office secara online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register"><Button size="lg" className="gap-2">Book a Space <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="#spaces"><Button size="lg" variant="outline">Explore Space</Button></a>
            </div>
            <div className="mt-10 flex gap-8">
              <div><p className="text-2xl font-bold text-slate-900">{spaces.length}+</p><p className="text-sm text-slate-500">Available Spaces</p></div>
              <div><p className="text-2xl font-bold text-slate-900">3</p><p className="text-sm text-slate-500">Space Categories</p></div>
              <div><p className="text-2xl font-bold text-slate-900">24/7</p><p className="text-sm text-slate-500">Online Booking</p></div>
            </div>
          </div>
          <div className="relative">
            <img src={HERO_IMAGE} alt="Coworking space" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl" />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><CalendarCheck className="h-5 w-5" /></div>
                <div><p className="text-sm font-semibold text-slate-900">Instant Booking</p><p className="text-xs text-slate-500">Konfirmasi cepat & mudah</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Space Types */}
      <section id="types" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Pilih Tipe Ruang Sesuai Kebutuhan</h2>
            <p className="mt-3 text-slate-600">Tiga kategori ruang kerja untuk mendukung produktivitas Anda.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TYPES.map((t) => (
              <div key={t.key} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
                <div className="h-44 overflow-hidden">
                  <img src={SPACE_TYPE_IMAGE[t.key]} alt={t.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{t.label}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section id="spaces" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Spaces</h2>
              <p className="mt-2 text-slate-600">Ruang kerja pilihan yang siap Anda pesan.</p>
            </div>
            <Link href="/login" className="hidden sm:block"><Button variant="outline" className="gap-2">Lihat Semua <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          {featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-slate-50 py-16 text-center text-slate-500">
              Belum ada space yang tersedia saat ini.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <div key={s.id} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img src={spaceImage(s)} alt={s.nama_space} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">{spaceTypeLabel(s.tipe)}</span>
                      <span className="text-sm font-bold text-primary">{formatCurrency(s.harga_per_jam)}<span className="text-xs font-normal text-slate-400">/jam</span></span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.nama_space}</h3>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.kapasitas} orang</span>
                      {s.owner?.nama_coworking && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {s.owner.nama_coworking}</span>}
                    </div>
                    {s.deskripsi && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{s.deskripsi}</p>}
                    <Link href="/login"><Button className="mt-4 w-full">Reservasi Sekarang</Button></Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Cara Kerjanya</h2>
            <p className="mt-3 text-slate-300">Empat langkah mudah untuk mulai bekerja di ruang favoritmu.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { icon: Search, title: "Cari Space", desc: "Jelajahi & filter ruang sesuai kebutuhan." },
              { icon: Clock, title: "Cek Ketersediaan", desc: "Pilih tanggal, jam, dan durasi." },
              { icon: Tag, title: "Pakai Promo", desc: "Masukkan kode promo untuk potongan harga." },
              { icon: QrCode, title: "Dapatkan E-Ticket", desc: "Terima e-ticket & QR code untuk check-in." },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary-foreground"><step.icon className="h-6 w-6 text-indigo-300" /></div>
                <h3 className="mt-4 font-semibold">{i + 1}. {step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Kenapa Smart Space Booking?</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wifi, title: "Fasilitas Lengkap", desc: "WiFi kencang, AC, dan fasilitas pendukung produktivitas." },
              { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Keamanan 24 jam dan proses booking yang transparan." },
              { icon: CalendarCheck, title: "Booking Fleksibel", desc: "Pesan per jam sesuai kebutuhan waktu Anda." },
              { icon: Tag, title: "Banyak Promo", desc: "Nikmati potongan harga dengan kode promo menarik." },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><f.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      {promos.length > 0 && (
        <section id="promo" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Promo Aktif</h2>
              <p className="mt-2 text-slate-600">Gunakan kode berikut saat reservasi.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((p) => (
                <div key={p.id} className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-primary px-3 py-1 text-lg font-extrabold text-primary-foreground">{p.persentase_diskon}% OFF</span>
                    <Tag className="h-6 w-6 text-primary/40" />
                  </div>
                  <p className="mt-4 text-lg font-bold tracking-wide text-slate-900">{p.nama_diskon}</p>
                  <p className="mt-1 text-sm text-slate-500">Berlaku {formatDate(p.tanggal_awal)} - {formatDate(p.tanggal_akhir)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-indigo-700 px-8 py-14 text-center text-white">
            <h2 className="text-3xl font-bold">Siap Memesan Ruang Kerja Anda?</h2>
            <p className="mx-auto mt-3 max-w-xl text-indigo-100">Bergabung sekarang dan nikmati kemudahan reservasi coworking space secara online.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register"><Button size="lg" variant="secondary" className="gap-2">Register Sekarang <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/login"><Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">Login</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
            <span className="font-bold text-slate-900">Smart Space Booking</span>
          </div>
          <p className="text-sm text-slate-500">UKK RPL 2026/2027 Paket B · Coworking Space Reservation</p>
        </div>
      </footer>
    </div>
  );
}
