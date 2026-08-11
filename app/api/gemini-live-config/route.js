import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

function getEffectiveApiKey() {
  const envKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (envKey && envKey.trim() && envKey !== "YOUR_GEMINI_API_KEY_HERE") {
    return envKey.trim()
  }

  try {
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8")
      const match = content.match(/GEMINI_API_KEY\s*=\s*(.*)/) || content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.*)/)
      if (match && match[1]) {
        const key = match[1].trim().replace(/^["']|["']$/g, "")
        if (key && key !== "YOUR_GEMINI_API_KEY_HERE") {
          return key
        }
      }
    }
  } catch (e) {
    console.error("Error reading .env.local dynamically in live-config:", e)
  }

  return null
}

export async function GET() {
  const apiKey = getEffectiveApiKey()
  if (!apiKey) {
    return NextResponse.json(
      { error: "NO_API_KEY", message: "Gemini API key is not configured." },
      { status: 400 }
    )
  }

  return NextResponse.json({ apiKey })
}
