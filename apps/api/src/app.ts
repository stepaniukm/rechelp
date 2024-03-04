import Fastify from 'fastify';
import FastifySensible from '@fastify/sensible';
import FastifyHelmet from '@fastify/helmet';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { version } from '../package.json';

export const getApplication = async () => {
	const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

	app.register(FastifySensible);
	app.register(FastifyHelmet);
	app.register(FastifySwagger, {
		openapi: {
			info: {
				title: '@rechelp/api',
				description: 'OpenAPI documentation for @rechelp/api',
				version,
			},
			servers: [{ url: 'http://localhost:4000' }],
		},
		hideUntagged: false,
	});
	app.register(FastifySwaggerUi);

	app.register(async (fastify) => {
		fastify.get(
			'/healthcheck',
			{
				schema: {
					tags: ['system'],
					response: {
						204: {},
					},
				},
			},
			async (_, reply) => {
				reply.status(204).send();
			},
		);
	});

	await app.ready();

	app.swagger();

	return app;
};
