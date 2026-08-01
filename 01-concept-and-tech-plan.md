# 自己紹介サイト — Concept & Technical Plan
### Luthfi (Rufi) — Interactive Scrollytelling Jikoshokai

> Dokumen ini adalah **master brief** untuk agent yang akan membangun website. Berisi konsep, arsitektur, tech stack, mekanik interaktif, sistem presentasi live, dan i18n. Konten teks lengkap ada di dokumen terpisah (`02-storyteller-script.md`). Daftar aset foto ada di `03-asset-checklist.md`.

---

## 1. Tujuan & Konteks

Website ini **menggantikan PowerPoint** sebagai alat presentasi *jikoshokai* (self-introduction) live di kantor baru (perusahaan listrik Jepang di Tokyo). Setelah presentasi, link/QR yang sama bisa dibuka siapa saja secara mandiri.

Karena itu website punya **dua nyawa** yang harus jalan berdampingan:

1. **Presentation Mode (live)** — Rufi memandu di depan audiens. Navigasi harus *terkontrol* (maju/mundur per beat pakai keyboard atau klik), tidak liar, tidak gampang ke-scroll kelewat. Setiap beat = satu "panggung" penuh layar.
2. **Explore Mode (mandiri)** — Orang buka lewat QR/link, scroll bebas menikmati cerita dengan segala animasinya.

**Prinsip inti:** kata "Explore" bukan cuma tema — website ini *membuat orang meng-explore*. Setiap interaksi harus memperkuat identitas "Explorer", bukan gimmick kosong.

---

## 2. Konsep Naratif: "Perjalanan di Peta"

Metafora pemandu keseluruhan: pengunjung mengikuti **jejak perjalanan Rufi**. Alur cerita bergerak seperti garis di peta — Jakarta → dunia → Jepang → Tokyo hari ini → undangan ke audiens.

Benang merah tunggal: **rasa penasaran yang selalu berujung aksi.** Suka jalan-jalan → ikut program biar gratis. Anki mahal → bikin app sendiri → 4.000+ user. Semua satu karakter.

---

## 3. Struktur Beat (Alur Cerita)

Setiap beat adalah satu section full-viewport. Urutan mengikuti script final yang sudah di-ACC.

| # | Beat | Signature Mechanic | Durasi bicara |
|---|------|-------------------|---------------|
| 00 | **Hero / Pembuka** | Name reveal + gag Naruto vs One Piece | ~2 mnt |
| 01 | **Explorer Manifesto** | 4 kata interaktif (場所・テクノロジー・食べ物・プロダクト) | ~1 mnt |
| 02 | **Keliling Dunia = ¥0** | Peta interaktif + trail menggambar sendiri + counter biaya ¥0 | ~2 mnt |
| 03 | **Detail Negara** | Taiwan · Thailand · Korea · Amerika (kartu reveal per pin) | (bagian dari 02) |
| 04 | **Osaka Expo 2025** ★ | Section immersive full-bleed, cerita bertahap (highlight utama) | ~2.5 mnt |
| 05 | **富士山登頂** ★ | **Scroll-to-climb**: scroll = mendaki, puncak = foto summit | ~1.5 mnt |
| 06 | **Teknologi & Produk** | Timeline 3 langkah (Academy → Startup → ObO) | ~2 mnt |
| 07 | **ObO** | Count-up 0 → 4.000+ saat masuk viewport + app mockup | (bagian dari 06) |
| 08 | **東京での生活** | Dua "mode" weekend (jalan-jalan / belajar bahasa) | ~1.5 mnt |
| 09 | **Penutup / Undangan** | Form rekomendasi tempat + QR + "4連休" CTA | ~0.5 mnt |

★ = dua signature moment paling "wah". Prioritaskan polish di sini.

**Total: ~13 menit** (aman di bawah 15 menit).

---

## 4. Tech Stack (Rekomendasi)

Dipilih untuk scrollytelling + parallax + kontrol presentasi + i18n. Agent boleh substitusi selama kapabilitasnya setara.

- **Framework:** Next.js (App Router) — SSR untuk SEO/share preview + routing i18n bawaan. Alternatif ringan: Vite + React.
- **Styling:** Tailwind CSS + CSS variables untuk design tokens (lihat §7).
- **Scroll animation:** **GSAP + ScrollTrigger** — engine utama untuk trail peta yang menggambar, Fuji climb, pinning section, parallax berlapis. Ini tulang punggung "wah"-nya.
- **UI transitions & micro-interactions:** Framer Motion (reveal, hover, count-up, page transitions).
- **i18n:** `next-intl` (kalau Next.js) atau `react-i18next`. Semua string dari file kamus JSON — **zero hardcoded text**. (lihat §6)
- **Map:** SVG kustom (bukan Google Maps) — lebih ringan, fully art-directed, gampang di-animate trail-nya. Peta stylized, bukan geografis akurat.
- **Deploy:** Vercel (native Next.js) atau Netlify. Dua-duanya kasih URL + gampang pasang custom domain nanti.
- **QR:** generate statis dari URL final, taruh di beat penutup + halaman /share.

---

## 5. Presentation Mode vs Explore Mode (KRUSIAL)

Ini fitur pembeda utama. Harus dirancang dari awal, bukan tempelan.

### Mekanisme
- **Scroll-snap per beat**: tiap section `min-height: 100svh` dengan snap, jadi tidak pernah berhenti di tengah-tengah dua beat.
- **Keyboard nav (mode live):** `→` / `Space` / `↓` = maju ke beat berikutnya (atau ke sub-step berikutnya di dalam beat multi-step seperti Osaka/Fuji). `←` / `↑` = mundur. `F` = fullscreen.
- **Progress indikator:** dot/garis tipis di pinggir menandai posisi beat (bisa disembunyikan di mode live via query param `?present=1`).
- **Sub-steps di dalam beat:** beat kompleks (Osaka Expo, Fuji, Timeline) punya langkah internal yang maju satu per satu saat tekan `→`, supaya Rufi bisa atur pacing kalimat. Contoh: Fuji punya 3 stop pendakian; tiap `→` naik satu stop.
- **Reduced motion:** hormati `prefers-reduced-motion` — animasi berat diganti fade sederhana.

### Query params
- `?present=1` → mode live: sembunyikan scrollbar/progress, aktifkan keyboard-driven stepping, disable free-scroll liar.
- default (tanpa param) → Explore Mode: free scroll, semua animasi scroll-triggered normal.

---

## 6. Internationalization (JP default, EN localization)

- **Default locale: `ja`**. Secondary: `en`.
- Toggle bahasa kecil di pojok (🌐 JA / EN), persist via localStorage.
- Semua teks di file kamus: `/locales/ja.json`, `/locales/en.json`. Struktur key per beat, misal `hero.title`, `osaka.body`, dst.
- Font harus render **kanji + latin** dengan baik (lihat §7).
- Angka/counter tetap sama; hanya label yang diterjemahkan.
- Script bicara (narration) **tidak** tampil di layar — disimpan sebagai catatan di storyteller doc untuk Rufi. (opsional: mode presenter notes tersembunyi, tekan `N`).

---

## 7. Design Tokens (konsisten dengan deck yang sudah ada)

Pertahankan identitas visual deck: **putih bersih + satu aksen oranye hangat**. Tapi tambah kedalaman untuk web (parallax butuh layer).

```
Warna:
--bg-primary    #FFFFFF   (dasar putih)
--bg-soft       #FAF9F7   (section selang-seling, kartu)
--bg-warm       #FFF3E8   (tint aksen, highlight card)
--accent        #E8934A   (oranye — signature, dipakai HEMAT)
--accent-deep   #C9742F   (hover/emphasis)
--ink           #1A1A2E   (teks utama, hampir hitam kebiruan)
--ink-soft      #4A4A5A   (teks sekunder)
--ink-mute      #8A8A9A   (caption)
--line          #E8E4DE   (garis/border halus)
```

```
Tipografi:
- Display (JP): "Zen Kaku Gothic New" atau "Noto Sans JP" (Bold/Black) — bersih, mudah dibaca, kanji jelas. HINDARI serif untuk kanji besar.
- Display (EN): pasangan sans yang berkarakter, mis. "Clash Display" / "General Sans" — tapi jaga agar tak bentrok dgn JP.
- Body: "Noto Sans JP" (JP) + "Inter" (EN).
- Data/counter: tabular-nums, boleh mono untuk angka besar (¥0, 4,000+).
```

**Aturan emas:** oranye adalah satu-satunya warna berani. Semua parallax/motion boleh ramai, tapi palet tetap disiplin. "Spend your boldness in one place."

---

## 8. Rincian Mekanik "Wah" (per signature)

### 8a. Peta + Trail (Beat 02) — signature #1
- SVG peta dunia stylized (Asia-Pasifik + US) dengan pin di tiap destinasi.
- Saat scroll masuk, **garis perjalanan menggambar dirinya** (SVG `stroke-dashoffset` animation via ScrollTrigger) dari Jakarta ke tiap pin berurutan.
- **Counter biaya**: angka besar mulai dari total "harga tiket normal" lalu jatuh ke **¥0**, dengan caption "modal: oleh-oleh doang".
- Klik/tap pin → kartu foto + micro-story negara muncul (ini menyatukan beat 03).
- Parallax: pin & awan bergerak beda kecepatan dgn peta.

### 8b. Fuji Climb (Beat 05) — signature #2
- Section di-*pin* (ScrollTrigger pin) — layar diam, konten bergerak saat scroll.
- Latar gunung Fuji dengan **kabut & langit ber-parallax berlapis**.
- Scroll ke bawah = "mendaki": posisi indikator pendaki naik, ketinggian bertambah (counter meter), warna langit berubah (siang → subuh → puncak).
- 3 stop pendakian dengan micro-caption. Stop terakhir: foto Rufi + tozanbu di puncak muncul dengan reveal dramatis.
- Di mode live, tiap `→` = naik satu stop.

### 8c. ObO Count-up (Beat 07)
- Saat masuk viewport, angka **menghitung naik 0 → 4,000+** (easing, ~1.5s).
- Di sebelahnya app mockup (frame iPhone) yang bisa di-swipe/loop menampilkan 2-3 screenshot ObO.
- Caption: "Anki が高いから、自分で作った。" → punchline.

### 8d. Osaka Expo (Beat 04) — highlight utama
- Full-bleed foto besar sebagai latar, teks reveal bertahap.
- Karena ini yang paling mau ditonjolkan, kasih ruang: 3 sub-step (konteks → apa yang dilakukan → kebanggaan representasi Indonesia).
- Efek: foto parallax zoom halus (Ken Burns) di background.

### 8e. Penutup interaktif (Beat 09)
- Form "おすすめを教えてください" — input tempat/makanan. Submit → simpan (bisa ke Google Sheet via webhook, atau localStorage + tampilkan sebagai "wall of recommendations" kalau mau komunal).
- QR code + URL untuk share.
- Highlight "来週4連休" sebagai konteks CTA.

---

## 9. Quality Floor (wajib)
- Responsive sampai mobile (QR akan dibuka di HP orang!). Semua signature mechanic harus punya fallback mobile yang tetap enak.
- Keyboard focus terlihat, navigasi aksesibel.
- `prefers-reduced-motion` dihormati.
- Loading cepat: lazy-load foto, preload hanya hero.
- Share preview (OG image) rapi buat WhatsApp/LINE.

---

## 10. Kebutuhan Aset (ringkas — detail di doc 03)
- ~20-25 foto pribadi (portrait, tiap negara 2-3, Osaka 2-3, Fuji 2-3 termasuk summit, ObO screenshots, Tokyo 2).
- Logo/ikon: NTUST, KAIST, Apple Developer Academy, ObO app icon.
- Placeholder dipakai dulu; slot foto sudah ditandai di storyteller doc.

---

## 11. Deliverable yang Diharapkan dari Agent
1. Repo Next.js jalan lokal + deploy ke Vercel/Netlify.
2. Dua mode (present/explore) berfungsi.
3. i18n JA/EN lengkap dari kamus.
4. Semua beat + signature mechanic sesuai doc ini & script.
5. Slot foto pakai placeholder, mudah diganti (folder `/public/photos` + manifest).
6. README cara ganti foto, ganti teks, generate QR, pasang domain.
