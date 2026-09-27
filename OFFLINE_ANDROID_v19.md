# Shodlik Education v19 — Offline Android (Vercel-independent)

## Maqsad
APK **Verselsiz** ishlaydi. Darslar, mashqlar, SRS, progress — Local-First (telefon ichida).

## Tuzatilgan narsalar (ready build)
- `skillPct` eksport (`src/lib/mastery.ts`)
- `lesson-player.tsx` ternary sintaksisi
- SPA mode (`vite.config.ts`)
- Relative `base: "./"`
- `mobile-build.mjs` — `.vercel/output/static` yoki `.output/public` ni to'g'ri yig'adi
- GitHub Actions: Node 22, Android SDK packages, `npm install`

## GitHub Actions
1. Shu kodni `main` ga push qiling
2. **Actions → Shodlik Education Android APK → Run workflow**
3. Artifact: **shodlik-education-debug-apk**

## Lokal
```bash
npm install
npm run build:mobile
npm run mobile:prepare
cd android && ./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Muhim
- `capacitor.config.json` da **server.url yo'q** — offline
- `webDir`: `.output/public`
- Auth mobile buildda o'chirilgan (`VITE_AUTH_ENABLED=false`)
