# 🏊 Swimming Race Simulator

Game web lomba renang gaya bebas 3D di kolam olimpiade 50 m, 8 lintasan, dengan kamera sinematik di belakang perenang.
Dibuat dengan **Three.js (WebGL di atas HTML5 Canvas)**, **JavaScript modern (ES modules)**, **Vite**, dan **Tailwind CSS v4**. Semua model, tekstur, dan suara dibuat prosedural, tanpa file aset.

## Menjalankan secara lokal

Butuh Node.js 18+.

```bash
cd swimming-race-simulator
npm install
npm run dev
```

Buka http://localhost:5173. Untuk build produksi: `npm run build` lalu `npm run preview`.

## Cara bermain

| Aksi | Tombol | Keterangan |
|---|---|---|
| **Dive Start** | `Enter` / `D` / tombol DIVE | Tekan tepat setelah bunyi start. Menekan saat *Take your marks* = **false start** (penalti 1 dtk). Reaksi cepat = lompatan jauh dan kecepatan masuk air tinggi. |
| **Kayuh** | `Spasi` / klik kolam / tombol KAYUH | Tekan saat jarum indikator ritme berada di **Sweet Spot** (hijau). Zona terang = PERFECT (+7% dorongan). |
| **Flip Turn** | `F` / tombol FLIP | Saat mendekati dinding balik, zona kuning muncul di lintasan 4. Tekan di bagian hijau (1,3–2,5 m dari dinding) untuk flip sempurna. Lupa menekan = *open turn* yang lambat. |
| Ganti kamera | `C` / tombol 🎥 | Belakang (kejar), Siaran TV, atau Atas. |
| Suara | `M` | |
| Keluar ke menu | `Esc` | |

**Ritme dan stamina**
- Terlalu cepat (spam): kayuhan lemah dan stamina terkuras drastis. Di bawah 30% stamina, setiap kayuhan melemah.
- Terlalu lambat: dorongan tiap kayuhan tetap, tetapi hambatan air membuat kecepatan turun di antara kayuhan.
- Saat stamina turun, sweet spot bergeser ke ritme yang sedikit lebih lambat (efek kelelahan).

## Lawan AI

7 lawan AI dalam tiga tingkat: **Pemula**, **Atlet Nasional**, dan **Juara Olimpiade**. Tiap tingkat punya kecepatan dasar, waktu reaksi, kualitas dive dan flip turn, kelelahan, serta sprint akhir yang berbeda. Komposisi lawan mengikuti pilihan **Tingkat Kompetisi** (Mudah / Sedang / Sulit). Seperti di final sungguhan, lawan tercepat ditempatkan di lintasan tengah.

## Struktur kode

```
src/
├── config.js                 # Semua konstanta & angka balancing (kolam, ritme, stamina, tier AI)
├── main.js                   # Entry point
├── core/
│   ├── Game.js               # Game loop, resize canvas, penghubung semua modul
│   ├── Race.js               # State lomba (prep → marks → racing → done), fixed timestep, hasil
│   ├── Input.js              # Keyboard / pointer / tombol sentuh → aksi
│   ├── EventBus.js           # Event pub/sub (logika ↔ efek visual & audio)
│   └── utils.js
├── entities/
│   └── Swimmer.js            # Posisi, dive, dinding, flip/open turn, finis
├── controllers/
│   ├── PlayerController.js   # Model ritme kayuhan, stamina, dive, flip turn pemain
│   └── AIController.js       # Perilaku AI per tingkat
├── render3d/
│   ├── Scene3D.js            # Renderer WebGL, cahaya, environment map, bayangan
│   ├── Pool3D.js             # Kolam: dasar berubin, tali lintasan, start block, gantry FINISH, zona flip
│   ├── WaterMaterials.js     # Shader air (gelombang, jejak perenang, Fresnel, kilau) & caustics dasar kolam
│   ├── Stadium3D.js          # Tribun + penonton bersorak, atap & lampu, papan iklan, layar skor langsung
│   ├── Swimmer3D.js          # Model perenang berangka + pose start, lompat, gaya bebas, flip turn, finis
│   ├── Effects3D.js          # Cipratan (gravitasi), buih, cincin riak
│   ├── CameraRig.js          # Kamera menu, start, kejar, siaran TV, atas, finis
│   └── textures.js           # Tekstur prosedural (ubin, nomor lintasan, spanduk, penanda)
├── audio/Sound.js            # Efek suara sintetis Web Audio (tanpa file aset)
└── ui/                       # HUD gaya siaran, menu, layar hasil dengan podium
```

Model fisika: setiap kayuhan menambah kecepatan (impuls), sedangkan air memberi hambatan eksponensial.
Kecepatan rata-rata ≈ impuls × frekuensi kayuhan ÷ hambatan, sehingga ritme stabil di sweet spot menghasilkan kecepatan tertinggi yang berkelanjutan.
Simulasi berjalan dengan langkah waktu tetap 1/120 dtk agar hasil lomba tidak bergantung pada FPS.
