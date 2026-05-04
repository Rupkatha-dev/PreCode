import { neon } from "@neondatabase/serverless"

export async function saveSession(
  spec: string,
  code: string,
  reflection: string,
  aiReflection: string
) {
  const sql = neon(process.env.DATABASE_URL!)
  await sql`
    INSERT INTO sessions (spec, code, reflection, ai_reflection)
    VALUES (${spec}, ${code}, ${reflection}, ${aiReflection})
  `
}
