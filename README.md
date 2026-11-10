# Umira CMS — Backend (NestJS + MySQL)

Panduan lengkap: lihat `../CMS-README.md`.

```bash
cp .env.example .env
npm install
npm run seed        # tabel + data awal (development memakai DB_SYNCHRONIZE=true)
npm run start:dev   # http://localhost:4000/api, Swagger di /api/docs
```

## Struktur
```
src/
├── main.ts                     bootstrap, CORS, helmet, static /uploads, Swagger
├── app.module.ts               TypeORM MySQL, guard global (JWT + role + throttle), audit log
├── common/                     enum, decorator (@Public, @MinRole), guard, interceptor audit, util
│   └── content/                service generik konten 2 bahasa (dipakai blog/proyek/karir)
├── modules/
│   ├── auth, users             login JWT, profil, manajemen user & role
│   ├── blogs, projects, careers  konten + tabel terjemahan (id/en)
│   ├── collections             item konten halaman berbasis skema (content-schemas/)
│   ├── settings                pengaturan singleton berbasis skema
│   ├── site-texts              teks next-intl per key & bahasa
│   ├── media                   upload file (multer) → uploads/YYYY/MM, aset seed → uploads/site/...
│   ├── inquiries               pesan formulir kontak
│   ├── activity-logs           log otomatis tiap perubahan
│   ├── dashboard               ringkasan
│   └── public                  endpoint tanpa login untuk website
└── database/
    ├── data-source.ts          untuk TypeORM CLI
    ├── migrations/             migrasi skema (production)
    └── seeds/                  seeder + impor konten website lama (seed-assets.ts = aset gambar)
```

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run start:dev` | development + hot reload |
| `npm run build` / `npm run start:prod` | build & jalankan production |
| `npm run seed` / `npm run seed:prod` | isi data awal (ts / hasil build) |
| `npm run migration:generate` | buat migrasi dari perubahan entity |
| `npm run migration:run` / `migration:run:prod` | jalankan migrasi |

## Aset gambar untuk seed

Gambar, video, dan PDF bawaan website disimpan di `seeds/assets/` (salinan dari
`frontend/website/public`: `images/`, `video/`, `docs/`, `favicon.ico`). Saat `npm run seed`:

1. file disalin ke `UPLOAD_DIR/site/...` (default `uploads/site/...`) dan didaftarkan di Media Library
2. semua konten seed (pengaturan, koleksi, blog, proyek, karir) memakai alamat `/uploads/site/...`
3. database lama yang masih memakai `/images/...` otomatis diarahkan ke file media

Aman dijalankan ulang: file yang sudah ada dilewati. Untuk menambah aset bawaan, letakkan file di
`seeds/assets/` dengan path yang sama seperti di website (mis. `images/home/banner.png`).
