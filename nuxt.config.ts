import { isDevelopment } from "std-env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineNuxtConfig({
  devServer: {
    host: "0.0.0.0",
    https: {
      cert: readFileSync(resolve(__dirname, "server.crt")).toString(),
      key: readFileSync(resolve(__dirname, "server.key")).toString(),
    },
  },
  modules: [
    "nuxt-auth-utils",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-security",
    "nuxt-typed-router",
    "nuxt-icon",
    "@vueuse/nuxt",
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
});
