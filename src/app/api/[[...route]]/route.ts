import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import images from "./images";

// export const runtime = 'edge';

const app = new Hono().basePath('/api')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/images", images);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;