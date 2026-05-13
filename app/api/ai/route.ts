import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { saveSession } from "@/lib/db"
import type { AIRequestBody } from "@/lib/types"

const MODEL = "llama-3.3-70b-versatile"

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

const SYSTEM_PROMPTS = {
  clarify: `You are a strict programming teacher.
The student must define behavior BEFORE coding.
Your job:
- Ask clarifying questions ONLY
- Do NOT give solutions
- Do NOT write code
- Focus on inputs, outputs, edge cases, and constraints

CRITICAL INSTRUCTION:
At the very end of your response, evaluate ONLY the MOST RECENT specification draft provided by the user. Rate its completeness from 1 to 5, ignoring any previous ratings. Format exactly as: RATING: X

If the spec is sufficiently clear and covers inputs, outputs, and key edge cases, respond ONLY with the exact text:
SPEC_READY: true
RATING: 5`,

  chat: `You help students during coding.
If they ask about syntax (e.g. how to use map, how to reverse a string, what does X mean), answer directly and concisely with a short example.
If they ask for debugging help (e.g. why is this wrong, fix my code, what's the bug, help me debug), do NOT fix it. Ask exactly one guiding question such as "What do you expect this to return?" or "What happens for empty input?"`,

  submit: `Compare the SPEC and CODE provided.
Identify exactly ONE mismatch between what the spec describes and what the code actually does.
Ask exactly ONE neutral question to prompt student reflection.
Do NOT give the answer or fix the code.`,
}

export async function POST(req: NextRequest) {
  try {
    const body: AIRequestBody = await req.json()

    if (body.type === "clarify") {
      const { prompt, spec, history } = body.payload
      const contextualSystem = `${SYSTEM_PROMPTS.clarify}\n\nExercise Prompt:\n${prompt}`
      const messages = [
        ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: spec },
      ]
      const completion = await getGroq().chat.completions.create({
        model: MODEL,
        messages: [{ role: "system", content: contextualSystem }, ...messages],
        temperature: 0.4,
        max_tokens: 512,
      })
      let aiMessage = completion.choices[0].message.content ?? ""
      
      let rating: number | undefined = undefined
      const ratingMatch = aiMessage.match(/RATING:\s*([1-5])/i)
      if (ratingMatch) {
        rating = parseInt(ratingMatch[1], 10)
        aiMessage = aiMessage.replace(/RATING:\s*[1-5]/gi, "").trim()
      }

      const specReady = aiMessage.includes("SPEC_READY: true")
      aiMessage = aiMessage.replace(/SPEC_READY:\s*true/g, "").trim()

      return NextResponse.json({ message: aiMessage, specReady, rating })
    }

    if (body.type === "chat") {
      const { prompt, code, message, history } = body.payload
      const contextualSystem = `${SYSTEM_PROMPTS.chat}\n\nExercise Prompt:\n${prompt}\n\nCurrent student code:\n\`\`\`\n${code}\n\`\`\``
      const messages = [
        ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user" as const, content: message },
      ]
      const completion = await getGroq().chat.completions.create({
        model: MODEL,
        messages: [{ role: "system", content: contextualSystem }, ...messages],
        temperature: 0.6,
        max_tokens: 512,
      })
      return NextResponse.json({ message: completion.choices[0].message.content ?? "" })
    }

    if (body.type === "submit") {
      const { prompt, spec, code } = body.payload
      const contextualSystem = `${SYSTEM_PROMPTS.submit}\n\nExercise Prompt:\n${prompt}`
      const userContent = `SPEC:\n${spec}\n\nCODE:\n${code}`
      const completion = await getGroq().chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: contextualSystem },
          { role: "user", content: userContent },
        ],
        temperature: 0.5,
        max_tokens: 512,
      })
      return NextResponse.json({ message: completion.choices[0].message.content ?? "" })
    }

    if (body.type === "save") {
      const { spec, code, reflection, aiReflection } = body.payload
      await saveSession(spec, code, reflection, aiReflection)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
