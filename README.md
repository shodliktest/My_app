# Shodlik Education — Offline-first

Asosiy o'qish (darslar, mashqlar, lug'at, progress) **internet siz** ishlaydi.
Progress telefon xotirasida saqlanadi (Local-First).

## Offline ekran
- Internet yo'q bo'lsa: yuqorida yumshoq banner (ilova bloklanmaydi)
- `public/offline-no-internet.png` — maxsus holatlar uchun

## Vercel (web)
```bash
npm install
npm run build
```

## Offline APK (GitHub Actions)
1. Ushbu repodagi **Actions → Build Android APK → Run workflow**
2. Artifact: **Shodlik-Education-apk**
3. `server.url` yo'q — APK ichidagi fayllardan ishlaydi (offline)

## Lokal
```bash
npm install
npm run dev
```
