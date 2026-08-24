import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import "dotenv/config";
import * as schema from "./schema";

neonConfig.webSocketConstructor = WebSocket;
// Required for PlanetScale Postgres connections

neonConfig.pipelineConnect = false;
neonConfig.wsProxy = (host, port) => `${host}/v2?address=${host}:${port}`;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Export the database connection and schema for use in other parts of the application
export const db = drizzle({ client: pool, schema });

// HTTP Connection example (uncomment to use):
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from './schema';

// export const db = drizzle(process.env.DATABASE_URL as string, { schema });
