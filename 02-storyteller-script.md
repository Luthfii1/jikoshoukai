# Storyteller Script — 自己紹介サイト
### Konten lengkap per beat: teks layar (JP + EN) + narasi bicara Rufi

> **Cara baca dokumen ini:**
> - **[ON SCREEN]** = teks yang tampil di website (masuk ke kamus i18n `ja.json` / `en.json`).
> - **[NARASI]** = yang Rufi ucapkan live (TIDAK tampil di layar; jadi presenter notes).
> - **[PHOTO]** = slot foto yang dibutuhkan (lihat asset checklist).
> - **[MECHANIC]** = catatan interaksi untuk agent.
>
> Bahasa narasi ditulis dalam Indonesia (untuk Rufi latihan) — versi Jepang yang diucapkan bisa disesuaikan gaya bicaranya sendiri.

---

## BEAT 00 — Hero / Pembuka

**[ON SCREEN — JA]**
- Nama: `Luthfi`
- Pill: `ルフィと呼んでください`
- Sub: `ジャカルタ → 東京`
- Eyebrow: `インドネシア出身 · ソフトウェアエンジニア`
- CTA button: `冒険をはじめる ↓`

**[ON SCREEN — EN]**
- Name: `Luthfi`
- Pill: `Call me Rufi`
- Sub: `Jakarta → Tokyo`
- Eyebrow: `From Indonesia · Software Engineer`
- CTA button: `Start the journey ↓`

**[MECHANIC]** Name reveal saat load (huruf muncul bertahap). Gag Naruto/One Piece sebagai animasi playful kecil: dua "cover" anime, yang One Piece di-silang (❌), Naruto di-highlight. Bisa berupa toggle kecil / stamp animasi. Tetap subtle, jangan norak.

**[PHOTO]** `hero-portrait` — 1 foto potret Rufi (bagus kalau ada nuansa Tokyo di belakang).

**[NARASI]**
"Halo semuanya! Perkenalkan, nama saya Luthfi — panggil saja Rufi. Oh, satu hal: biasanya orang langsung nanya 'One Piece suki desu ka?', padahal saya belum pernah nonton. Tapi kalau mau ngobrol Naruto, saya siap kapan saja.
Saya dari Jakarta, dan sekarang tinggal di sharehouse di Itabashi-ku. Ada dua teman saya dari Indonesia yang juga di Tokyo — Adryan dan Seshi. Tapi saya pilih tinggal sendiri karena lebih murah, dan kebetulan saya sudah terbiasa mandiri jadi tidak masalah."

---

## BEAT 01 — Explorer Manifesto

**[ON SCREEN — JA]**
- Headline: `私を一言で表すなら。`
- 4 kata (interaktif): `場所` / `テクノロジー` / `食べ物` / `プロダクト`
- Quote besar: `「気になったら、まずやってみる。」`
- Sub: `読むだけで終わらせない。`

**[ON SCREEN — EN]**
- Headline: `One word that describes me.`
- 4 words: `Places` / `Technology` / `Food` / `Products`
- Quote: `"If I'm curious, I just try it."`
- Sub: `I never stop at just reading about it.`

**[MECHANIC]** 4 kata bisa di-hover (desktop) / tap (mobile) → masing-masing memunculkan preview mini (ikon + 1 baris). Kata besar "EXPLORER" sebagai watermark background (seperti di deck).

**[NARASI]**
"Kalau harus menggambarkan diri saya dalam satu kata: Explorer. Saya suka explore — tempat, teknologi, produk, makanan. Kalau sudah penasaran, langsung coba. Nggak berhenti di baca-baca doang."

---

## BEAT 02 — Keliling Dunia = ¥0 (Peta + Trail)

**[ON SCREEN — JA]**
- Headline: `世界一周。` + badge `全部タダ。`
- Sub: `学生時代、お金はなかった。だからプログラムと大会に応募しまくった。`
- Counter label: `旅費の合計`
- Counter value: (animasi turun ke) `¥0`
- Counter caption: `払ったのはお土産代だけ。`

**[ON SCREEN — EN]**
- Headline: `Around the world.` + badge `All free.`
- Sub: `As a student I had no money — so I applied to every program and competition I could.`
- Counter label: `Total travel cost`
- Counter value: `¥0`
- Counter caption: `The only thing I paid for was souvenirs.`

**[MECHANIC]** Peta SVG stylized. Trail menggambar Jakarta → Taiwan → Thailand → Korea → USA → Osaka saat scroll. Counter biaya jatuh dramatis ke ¥0. Tiap pin bisa diklik → buka kartu negara (beat 03).

**[NARASI]**
"Karena saya suka jalan-jalan, masalahnya satu: duitnya dari mana? Waktu itu saya masih kuliah. Cara saya: daftar berbagai program dan kompetisi. Semuanya gratis — saya cuma perlu modal beli oleh-oleh."

---

## BEAT 03 — Detail Negara (kartu per pin)

Empat kartu, muncul saat pin diklik atau saat scroll melewati. Masing-masing: bendera, nama, program, tahun, 2-3 foto, 1 baris cerita.

### 🇹🇼 台湾 / Taiwan
**[ON SCREEN — JA]** `NTUSTインターンシップ` · `2022年` · `5Gネットワークの研究。初めての海外インターン。`
**[ON SCREEN — EN]** `NTUST Internship` · `2022` · `Researching 5G networks. My first internship abroad.`
**[PHOTO]** `taiwan-1`, `taiwan-2`, `taiwan-3`
**[NARASI]** "Semua berawal dari internship di NTUST Taiwan — riset jaringan 5G. Ini pengalaman kerja pertama saya."

### 🇹🇭 タイ / Thailand
**[ON SCREEN — JA]** `サマーSDGプログラム` · `2023年` · `SDGsをテーマにした国際プログラム。バンコクにて。`
**[ON SCREEN — EN]** `Summer SDG Program` · `2023` · `An international program on the SDGs, in Bangkok.`
**[PHOTO]** `thailand-1`, `thailand-2`, `thailand-3`
**[NARASI]** "Lalu Summer SDG Program di Thailand, di Bangkok."

### 🇰🇷 韓国 / Korea
**[ON SCREEN — JA]** `KAISTマスターキャンプ` · `2023年` · `韓国トップの理系大学でのプログラム。ソウルにて。`
**[ON SCREEN — EN]** `KAIST Master Camp` · `2023` · `A program at Korea's top science university, in Seoul.`
**[PHOTO]** `korea-1`, `korea-2`, `korea-3`
**[NARASI]** "Master Camp di KAIST Korea — salah satu universitas sains terbaik di Asia."

### 🇺🇸 アメリカ / USA
**[ON SCREEN — JA]** `リーダーシッププログラム` · `2023年` · `リーダーシップ研修に選抜。ダメ元で応募したら受かった。`
**[ON SCREEN — EN]** `Leadership Program` · `2023` · `Selected for a leadership program. Applied on a whim and got in.`
**[PHOTO]** `usa-1`, `usa-2`, `usa-3`
**[NARASI]** "Dan Leadership Program di Amerika. Daftar iseng, eh keterima."

---

## BEAT 04 — Osaka Expo 2025 ★ (highlight)

**[ON SCREEN — JA]**
- Headline: `大阪・関西万博 2025`
- Tags: `コンペティション` · `ファイナリスト` · `2025年`
- Step 1: `単なる観光じゃなかった。`
- Step 2: `コンペのファイナリストとして参加した。`
- Step 3: `インドネシアを代表して、世界規模の舞台で戦えたことが誇りだった。`

**[ON SCREEN — EN]**
- Headline: `Osaka Expo 2025`
- Tags: `Competition` · `Finalist` · `2025`
- Step 1: `This wasn't just sightseeing.`
- Step 2: `I took part as a competition finalist.`
- Step 3: `Representing Indonesia on a global stage — that made me proud.`

**[MECHANIC]** Full-bleed foto Expo, Ken Burns zoom halus. 3 sub-step reveal bertahap (di mode live, tiap `→` munculkan step berikut).
**[PHOTO]** `osaka-1` (hero besar), `osaka-2`, `osaka-3`

**[NARASI]**
"Yang paling berkesan: Osaka Expo 2025. Saya ikut sebagai finalis kompetisi — jadi bukan sekadar jalan-jalan, tapi berkompetisi langsung. Ketemu peserta dari berbagai negara, dan rasanya bangga bisa mewakili Indonesia di panggung sebesar itu."

---

## BEAT 05 — 富士山登頂 ★ (Fuji Climb)

**[ON SCREEN — JA]**
- Headline: `富士山登頂。`
- Altitude counter: `0 m → 3,776 m`
- Stop 1: `登山部の仲間と出発。`
- Stop 2: `夜通し登る。`
- Stop 3 (puncak): `ご来光。一生忘れない。`

**[ON SCREEN — EN]**
- Headline: `Climbing Mt. Fuji.`
- Altitude: `0 m → 3,776 m`
- Stop 1: `Setting off with my hiking club.`
- Stop 2: `Climbing through the night.`
- Stop 3: `Sunrise at the summit. Never forgetting this.`

**[MECHANIC]** Section pinned. Scroll = mendaki: indikator pendaki naik, counter ketinggian bertambah, langit berubah (malam → subuh → sunrise di puncak). Foto summit reveal dramatis di akhir. Mode live: `→` naik satu stop.
**[PHOTO]** `fuji-1` (start/trail), `fuji-2` (malam/pendakian), `fuji-3` (SUMMIT — foto paling penting, Rufi + tozanbu + sunrise).

**[NARASI]**
"Di Jepang juga sama semangatnya. Sudah ke Kamakura, Osaka, Kyoto... tapi yang paling saya banggakan: naik ke puncak Fuji-san bersama teman-teman tozanbu. Kami mendaki semalaman, dan lihat matahari terbit dari puncak. Pengalaman yang tidak akan saya lupakan."

---

## BEAT 06 — Teknologi & Produk (Timeline)

**[ON SCREEN — JA]**
- Headline: `テクノロジー & プロダクト。`
- 01 `Apple Developer Academy` — `ジャカルタ。実際に使われるプロダクトの作り方を学んだ。`
- 02 `スタートアップ（一時停止中）` — `ヘルスケア分野で挑戦。難しかったが、一番学んだ経験。`
- 03 `ObO App` — (lanjut ke beat 07)

**[ON SCREEN — EN]**
- Headline: `Technology & Products.`
- 01 `Apple Developer Academy` — `Jakarta. Learned how to build products people actually use.`
- 02 `Startup (on pause)` — `Took on healthcare. Hard — but I learned the most here.`
- 03 `ObO App` — (continues)

**[MECHANIC]** Timeline 3 langkah, reveal berurutan. Langkah 03 nyambung ke count-up ObO.

**[NARASI]**
"Rasa explore yang sama saya bawa ke teknologi. Masuk Apple Developer Academy, coba bangun startup di bidang kesehatan — susah, tapi paling banyak belajar di situ."

---

## BEAT 07 — ObO (Count-up)

**[ON SCREEN — JA]**
- Big number: `4,000+`
- Label: `ダウンロード`
- Line: `Ankiが高いから、自分で作った。`
- Punch: `気づいたら、4,000人以上が使っていた。`

**[ON SCREEN — EN]**
- Big number: `4,000+`
- Label: `downloads`
- Line: `Anki was expensive, so I built my own.`
- Punch: `Before I knew it, 4,000+ people were using it.`

**[MECHANIC]** Angka menghitung 0 → 4,000+ saat masuk viewport. App mockup iPhone dengan 2-3 screenshot ObO (swipe/loop).
**[PHOTO]** `obo-screen-1`, `obo-screen-2`, `obo-screen-3` (screenshot app) + `obo-icon`.

**[NARASI]**
"Terus iseng bikin aplikasi belajar kosakata Jepang buat diri sendiri, karena Anki mahal. Upload ke App Store — sekarang sudah lebih dari 4.000 orang install. Saya sendiri yang paling kaget."

---

## BEAT 08 — 東京での生活 (Tokyo Life)

**[ON SCREEN — JA]**
- Headline: `東京での生活。`
- Card A `街を探索` — `週末は東京を歩き回る。まだ知らない場所だらけ。` — badge `土・日`
- Card B `日本語を勉強` — `語彙を増やすために毎日。ObOも自分で使ってる。` — badge `毎日`
- Footnote: `板橋区のシェアハウスに一人暮らし — その方が安いから。`

**[ON SCREEN — EN]**
- Headline: `Life in Tokyo.`
- Card A `Exploring the city` — `Wandering Tokyo on weekends. So many places I don't know yet.` — badge `Sat–Sun`
- Card B `Studying Japanese` — `Every day, to grow my vocabulary. I use ObO myself too.` — badge `Daily`
- Footnote: `Living solo in a sharehouse in Itabashi — because it's cheaper.`

**[MECHANIC]** Dua kartu parallax ringan. Bisa hover tilt.

**[NARASI]**
"Sekarang kalau libur, dua mode saya: jalan-jalan explore Tokyo, atau belajar bahasa Jepang. Kadang sambil ngoprek ObO juga."

---

## BEAT 09 — Penutup / Undangan

**[ON SCREEN — JA]**
- Headline: `東京でまだexploreしていないこと：`
- Highlight: `みなさんのおすすめ`
- Body: `来週、4連休があります。おすすめの場所や食べ物があれば、ぜひ教えてください。ちゃんとメモします。`
- Form placeholder: `場所・食べ物を教えてください…`
- Submit button: `おすすめを送る`
- Sign-off: `よろしくお願いします！`
- QR caption: `このページをシェア`

**[ON SCREEN — EN]**
- Headline: `The one thing I haven't explored in Tokyo:`
- Highlight: `Your recommendations`
- Body: `I have a 4-day holiday next week. If you know a great place or food, please tell me — I'll take real notes.`
- Form placeholder: `Suggest a place or food…`
- Submit: `Send recommendation`
- Sign-off: `Yoroshiku onegaishimasu!`
- QR caption: `Share this page`

**[MECHANIC]** Form submit → webhook ke Google Sheet (atau localStorage + wall). QR code + URL. Highlight "4連休".

**[NARASI]**
"Senang bisa bergabung di kantor ini. Banyak yang ingin saya pelajari dari kalian. Oh — minggu depan ada libur 4 hari, kalau ada rekomendasi tempat atau makanan yang wajib dicoba, tolong kasih tau saya lewat form ini. Yoroshiku onegaishimasu!"

---

## Catatan Tone (untuk copywriting EN)
- JP: sopan tapi hangat, bukan kaku. Cocok konteks kantor Jepang.
- EN: conversational, ringkas, sedikit witty (pertahankan gag & punchline). Jangan terjemahan harfiah — adaptasi biar tetap lucu.
