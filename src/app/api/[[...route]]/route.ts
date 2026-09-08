import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import images from './images';
import { auth } from '@/lib/auth/auth';

// export const runtime = 'edge';

const app = new Hono().basePath('/api');
app.all('/auth/*', (c) => auth.handler(c.req.raw));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route('/images', images);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
