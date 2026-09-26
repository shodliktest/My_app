# Elli — Ingliz tili o'rganish ilovasi

Vite + React + TanStack Start asosida yasalgan.

## 📱 APK ni GitHub Actions orqali olish (Android Studio kerak emas)

### 1-qadam: GitHub ga yuklash

1. [github.com](https://github.com) da yangi repository yarating (masalan `elli-app`)
2. Kompyuteringizda yoki GitHub web orqali fayllarni yuklang:

```bash
git init
git add .
git commit -m "Elli app"
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/elli-app.git
git push -u origin main
```

### 2-qadam: APK yasash

1. GitHub repository sahifasida **Actions** bo‘limiga kiring
2. Chapda **Build Android APK** ni tanlang
3. **Run workflow** tugmasini bosing
4. 5–10 daqiqa kuting

### 3-qadam: Yuklab olish

1. Workflow tugagach, pastga tushing
2. **Artifacts** bo‘limida **Elli-debug-apk** ni ko‘rasiz
3. Uni bosib **app-debug.apk** ni yuklab oling
4. Telefoningizga o‘tkazing va o‘rnating (noma’lum manbalarga ruxsat bering)

> Har safar `main` ga push qilsangiz ham avtomatik yangi APK yasaydi.

---

## Lokal ishga tushirish (ixtiyoriy)

```bash
npm install
npm run dev
```

Brauzer: http://localhost:8080

## Capacitor (o‘zingiz Android Studio bilan)

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build:mobile
npx cap add android
npx cap sync
npx cap open android
```
