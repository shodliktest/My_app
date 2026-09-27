# Shodlik Education — Offline APK (Verselsiz)

## Nima o'zgardi?
- TanStack Start **SPA mode** yoqildi (`spa: { enabled: true }`)
- `defaultSsr: false` — dastlabki sahifa faqat klientda chiziladi
- Capacitor **server.url yo'q** — APK telefon ichidagi fayllardan ishlaydi

## APK
1. GitHub Actions → **Build Android APK (Offline SPA)**
2. Artifact: **Shodlik-Education-offline-apk**
3. Internet **shart emas** (asosiy darslar Local-First)

## Web (ixtiyoriy)
Vercel ga ham deploy qilish mumkin — SPA shell CDN da ham ishlaydi.
