// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-auth-utils", "@nuxt/image", "@nuxt/ui"],
  devtools: { enabled: true },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
      },
    },
  },
});
