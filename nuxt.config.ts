import { isDevelopment } from "std-env";

export default defineNuxtConfig({
  modules: [
    "nuxt-auth-utils",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-security",
    "nuxt-typed-router",
    "nuxt-icon",
    "@vueuse/nuxt",
    "nuxt-monaco-editor",
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
      },
    },
  },
  security: {
    rateLimiter: isDevelopment ? false : undefined,
    headers: {
      crossOriginEmbedderPolicy: isDevelopment ? "unsafe-none" : "require-corp",
    },
  },
  monacoEditor: {
    lang: "pl",
  },
});
