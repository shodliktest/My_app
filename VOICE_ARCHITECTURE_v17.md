# Voice Architecture v17

Shodlik Education uses a local-first speech layer. All lesson, vocabulary, review, shadowing and practice audio goes through `src/lib/speech.ts`.

Priority:
1. Optional ResponsiveVoice natural voice when `VITE_RESPONSIVEVOICE_KEY` is configured.
2. Device/browser English voice as automatic fallback.

The application never requires a speech API to function. ResponsiveVoice is loaded lazily only when a key is configured. The key should be supplied through deployment environment variables, not committed into source.

For higher-fidelity Microsoft neural speech, Azure Speech can be added behind a server endpoint later. Microsoft currently lists an F0 tier with 0.5 million neural TTS characters/month and supports SSML for rate, pitch, pauses and pronunciation control. Keep the Azure key server-side.
