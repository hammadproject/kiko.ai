import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing from .env.local");
}

const migrationUrl = new URL(
  "../db/migrations/202609290001_create_consultation_leads.sql",
  import.meta.url,
);
const migration = await readFile(fileURLToPath(migrationUrl), "utf8");
const sql = neon(databaseUrl);

await sql.query(migration);

const verificationEmail = `connection-check-${Date.now()}@example.invalid`;
await sql.transaction([
  sql`insert into public.consultation_leads (
    full_name,
    email,
    phone_number,
    source
  ) values (
    'Connection Check',
    ${verificationEmail},
    '+10000000000',
    'migration-check'
  )`,
  sql`delete from public.consultation_leads where email = ${verificationEmail}`,
]);

console.log("Neon migration applied and write access verified.");
