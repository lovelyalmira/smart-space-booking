# Smart Space Booking

Web application (Frontend Web) untuk reservasi coworking space / workstation — dibuat untuk **UKK RPL SMK Telkom Malang 2026/2027 — Paket B**. Aplikasi mengonsumsi **API resmi panitia** sebagai satu-satunya sumber data (tidak ada backend/database sendiri, tidak ada mock data pada fitur utama).

## Description
Member dapat menjelajah space, mengecek ketersediaan, memakai kode promo, membuat reservasi, melihat status & histori, serta membuka e-ticket ber-QR code yang bisa dicetak. Admin (pengelola space) dapat mengelola profil coworking, member, space, promo, reservasi (approve / cancel / check-in / check-out), serta melihat laporan pendapatan.

## Technology
- Next.js 15 (App Router) + React 18
- TypeScript
- Tailwind CSS + shadcn/ui + lucide-react
- TanStack React Query (server state)
- React Hook Form + Zod (form & validasi)
- Axios (API client terpusat dengan interceptor)
- Recharts (grafik laporan)
- qrcode.react (QR code e-ticket)

## Requirements
- Node.js 18+
- Yarn (atau npm)

## Installation
```bash
yarn install
# atau: npm install
```

## Environment Variables
Buat file `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://learn.smktelkom-mlg.sch.id/coworking
NEXT_PUBLIC_APP_KEY=mk_ae2170320b494b5d8727c9361dbced3a
```
> `NEXT_PUBLIC_APP_KEY` dikirim otomatis sebagai header `x-maker-key` pada setiap request (mekanisme multi-tenancy API). Token user disimpan di localStorage + cookie dan dikirim sebagai `Authorization: Bearer <token>` untuk endpoint terproteksi.

## Run Development
```bash
yarn dev
# app: http://localhost:3000
```

## Build Production
```bash
yarn build
yarn start
```

## API Configuration
- API client terpusat: `lib/api.ts` (baseURL dari env, interceptor menambahkan `x-maker-key` + `Authorization`).
- Response handler: envelope `{ status, statusCode, message, data, timestamp }` di-unwrap; error API ditampilkan via toast/inline.
- Service per domain: `services/*.service.ts` (auth, space, discount, reservation, member, admin, admin-reservation, report, upload).

## Available Roles
- `member` → area `/member/*`
- `admin_space` → area `/admin/*`

Proteksi route menggunakan `middleware.ts` (berbasis cookie) + guard client pada layout dashboard.

## Main Features
**Member:** register, login, profil, explore & search & filter space, detail space, cek availability, kode promo, buat reservasi, my reservations, cancel, history (filter bulan/tahun), e-ticket + QR + print.

**Admin:** dashboard ringkasan, profil coworking, CRUD member (+upload foto), CRUD space (+upload foto), CRUD promo, manajemen reservasi (filter + approve/cancel/check-in/check-out), laporan pendapatan (cards + chart).

## Folder Structure
```
app/
  page.tsx                 # landing page
  login/ register/         # auth
  member/                  # dashboard, spaces, reservations, history, profile
  admin/                   # dashboard, profile, members, spaces, discounts, reservations, reports
components/
  layout/  shared/  reservation/  ui/(shadcn)
lib/       api.ts auth.ts image.ts format.ts config.ts space-images.ts
services/  *.service.ts
types/     index.ts
middleware.ts
```

## Space Types
`desk` → Personal Desk · `meeting_room` → Meeting Room · `private_office` → Private Office

## Reservation Status (UI mapping)
`belum_dikonfirm` → Belum Dikonfirmasi · `disetujui` → Disetujui · `aktif` → Aktif / Digunakan · `selesai` → Selesai · `dibatalkan` → Dibatalkan
