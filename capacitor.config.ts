import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Offline-first APK: serves bundled web assets from the device.
 * Do NOT set server.url unless you intentionally want an online wrapper.
 */
const config: CapacitorConfig = {
  appId: "com.shodlik.education",
  appName: "Shodlik Education",
  webDir: "dist/client",
  server: {
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
