import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"

// Load DATABASE_URL from .env manually (no dotenv needed)
const env = readFileSync(".env", "utf8")
const match = env.match(/DATABASE_URL=(.+)/)
if (!match) {
  console.error("DATABASE_URL not found in .env")
  process.exit(1)
}
const DATABASE_URL = match[1].trim()

const sql = neon(DATABASE_URL)

async function setup() {
  console.log("Creating sessions table...")

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id        SERIAL PRIMARY KEY,
      spec      TEXT NOT NULL,
      code      TEXT NOT NULL,
      reflection     TEXT NOT NULL,
      ai_reflection  TEXT NOT NULL,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `

  console.log("Done. Table 'sessions' is ready.")
}

setup().catch((err) => {
  console.error("Setup failed:", err.message)
  process.exit(1)
})
