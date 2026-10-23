import { Pool } from "pg";
import { buildApp } from "./app.ts";
import { PostgresEnquiryRepository } from "./enquiries/postgres.ts";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required for the enquiry API.");

const pool = new Pool({ connectionString: url, max: 10, connectionTimeoutMillis: 5000 });
const app = await buildApp({
  repository: new PostgresEnquiryRepository(pool),
  allowSampleEnquiries: process.env.ALLOW_SAMPLE_ENQUIRIES === "true",
  allowedOrigins: (process.env.FRONTEND_ORIGINS || "https://nanaaddodba.github.io,http://localhost:5173")
    .split(",").map((value) => value.trim()).filter(Boolean),
});
const port = Number(process.env.PORT || 8080);

async function shutdown() {
  await app.close();
  await pool.end();
}
process.on("SIGTERM", () => { void shutdown(); });
process.on("SIGINT", () => { void shutdown(); });
await app.listen({ host: "0.0.0.0", port });
