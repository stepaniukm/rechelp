import { getApplication } from './src/app.js';

const app = await getApplication();
const port = Number(process.env['PORT']) || 3000;

app.listen({
	port,
});
