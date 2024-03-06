import GithubProvider from '@auth/core/providers/github';
import type { AuthConfig } from '@auth/core/types';
import { NuxtAuthHandler } from '#auth';

const runtimeConfig = useRuntimeConfig();

export const authOptions = {
	// https://github.com/Hebilicious/authjs-nuxt/issues/158
	basePath: '/api/auth',
	secret: runtimeConfig.authJs.secret,
	providers: [
		GithubProvider({
			clientId: runtimeConfig.github.clientId,
			clientSecret: runtimeConfig.github.clientSecret,
		}),
	],
} satisfies AuthConfig;

export default NuxtAuthHandler(authOptions, runtimeConfig);
