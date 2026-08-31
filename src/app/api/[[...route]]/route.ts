import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import user from "./user";

// export const runtime = 'edge';

const app = new Hono().basePath('/api')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/user", user);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;