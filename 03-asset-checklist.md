# Asset Checklist — 自己紹介サイト
### Daftar foto & aset yang perlu Rufi siapkan

> Semua slot pakai **placeholder dulu**. Ganti belakangan. Simpan di `/public/photos/` dengan nama file persis seperti ID di bawah (biar gampang di-map). Format: JPG/WebP, sisi panjang ≥1600px, orientasi sesuai catatan.

---

## Prioritas 1 — Wajib (signature moments)

| ID | Beat | Deskripsi | Orientasi | Catatan |
|----|------|-----------|-----------|---------|
| `hero-portrait` | Hero | Potret Rufi | Portrait | Idealnya ada nuansa Tokyo/urban di belakang |
| `osaka-1` | Osaka Expo | Foto besar di Expo (hero background) | Landscape | Yang paling representatif — dipakai full-bleed |
| `fuji-3` | Fuji | **PUNCAK Fuji** — Rufi + tozanbu + sunrise | Landscape | Foto paling penting di seluruh site. Momen klimaks. |

---

## Prioritas 2 — Per Negara (2-3 foto each)

| ID | Negara | Saran isi |
|----|--------|-----------|
| `taiwan-1/2/3` | Taiwan | Kegiatan lab/riset 5G, kampus NTUST, suasana Taipei |
| `thailand-1/2/3` | Thailand | Program SDG, grup peserta, Bangkok |
| `korea-1/2/3` | Korea | KAIST campus, kegiatan camp, Seoul |
| `usa-1/2/3` | Amerika | Leadership program, grup, landmark |
| `osaka-2/3` | Osaka Expo | Detail kompetisi, momen presentasi, peserta |
| `fuji-1/2` | Fuji | `fuji-1` start/trail siang · `fuji-2` pendakian malam |

*(kalau tiap negara cuma punya 1-2 foto bagus, nggak masalah — layout adaptif)*

---

## Prioritas 3 — Produk & Tokyo

| ID | Beat | Deskripsi |
|----|------|-----------|
| `obo-icon` | ObO | App icon ObO (PNG transparan) |
| `obo-screen-1/2/3` | ObO | Screenshot app ObO (portrait, rasio iPhone) |
| `tokyo-1` | Tokyo Life | Weekend explore Tokyo |
| `tokyo-2` | Tokyo Life | Belajar / suasana kerja |

---

## Aset Grafis (opsional, kalau ada)

| ID | Dipakai di | Catatan |
|----|-----------|---------|
| `logo-ntust` | Taiwan | Logo institusi (kalau boleh dipakai) |
| `logo-kaist` | Korea | — |
| `logo-apple-academy` | Timeline | Apple Developer Academy |

*Kalau logo institusi tidak tersedia/tidak boleh, cukup teks nama — aman.*

---

## Ringkasan Jumlah
- **Wajib banget:** 3 (portrait, osaka hero, fuji summit)
- **Ideal total:** ~22 foto + 4 screenshot + ikon
- **Minimum bisa jalan:** ~8 foto (hero, 1 per negara, osaka, fuji summit, 1 obo screen)

Kalau Rufi kasih yang ada dulu, sisanya pakai placeholder — site tetap jalan penuh.

---

## Format & Teknis (untuk agent)
- Kompres ke WebP untuk web; sediakan fallback JPG.
- Lazy-load semua kecuali `hero-portrait`.
- Simpan manifest `/public/photos/manifest.json` yang memetakan ID → path + alt text (JP & EN) biar gampang di-maintain.
- OG share image: pakai `osaka-1` atau `fuji-3` + judul "Luthfi — 自己紹介".
