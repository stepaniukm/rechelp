// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	vite: {
		optimizeDeps: { include: ['cookie'] },
	},
	modules: ['@hebilicious/authjs-nuxt', '@nuxt/image', '@nuxt/ui'],
	devtools: { enabled: true },
	experimental: {
		componentIslands: true,
	},
	runtimeConfig: {
		authJs: {
			secret: process.env.NUXT_NEXTAUTH_SECRET,
		},
		github: {
			clientId: process.env.NUXT_GITHUB_CLIENT_ID,
			clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
		},
		public: {
			authJs: {
				baseUrl: process.env.NUXT_NEXTAUTH_URL,
				verifyClientOnEveryRequest: true,
			},
		},
	},
});
