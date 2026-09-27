import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
  // Client-first: works offline inside Capacitor WebView
  defaultSsr: false,
}));
