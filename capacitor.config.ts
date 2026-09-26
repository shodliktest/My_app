import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elli.app',
  appName: 'Elli',
  webDir: 'dist/client',
  server: {
    url: 'https://myapp-rose-alpha.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
