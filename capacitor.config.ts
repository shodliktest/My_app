import type { CapacitorConfig } from "@capacitor/cli";

/** Offline APK — local assets only, no Vercel */
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
