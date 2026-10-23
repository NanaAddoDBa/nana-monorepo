import { readFile } from "node:fs/promises";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const sql = await readFile(new URL("./migrations/001_enquiries.sql", import.meta.url), "utf8");
  await pool.query(sql);
  process.stdout.write("Database migration complete.\n");
} finally {
  await pool.end();
}
