# Shodlik Education v19 — Vercel-independent Android build

## What this adds

The same React/TanStack source can now be packaged into a self-contained Android APK with Capacitor. The APK does **not** use a Vercel `server.url` and does not need Vercel to start the core learning experience.

## Offline-first guarantees

- Curriculum, lessons, exercises, SRS, mistakes, mastery and adaptive logic are client/local-first.
- The Android build explicitly uses `VITE_AUTH_ENABLED=false`.
- AI is optional and never required for the core learning loop.
- ResponsiveVoice is optional; device/native speech is the fallback.
- No Vercel domain is configured as the Capacitor app server.
- The APK loads the bundled `.output/public` assets directly.

## GitHub Actions

Push to `main` or run **Actions → Shodlik Education Android APK → Run workflow**.

The workflow:

1. installs Node 22 dependencies;
2. creates the offline-first web build;
3. installs Capacitor 8.5.2 temporarily;
4. generates/synchronizes the Android project;
5. builds `app-debug.apk`;
6. uploads it as `shodlik-education-debug-apk`.

## Local build

```bash
npm ci
npm run build:mobile
npm run mobile:prepare
cd android
./gradlew assembleDebug
```

## Optional natural voice

Create the GitHub repository secret `RESPONSIVEVOICE_KEY` if you want ResponsiveVoice in environments where the provider is reachable. Leaving it empty is supported. The app falls back to device/browser speech.

## Important

The workflow intentionally creates an **installable debug APK** for testing/distribution outside Google Play. A Play Store release needs Android signing configuration and a release workflow with a keystore stored in GitHub Actions secrets.
