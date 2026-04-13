import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const MODEL = "gemini-2.0-flash";  // stable, always available

// ── API Key Pool ─────────────────────────────────────────────
const getApiKeys = () =>
  [
        process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
    process.env.GEMINI_API_KEY_7,
    process.env.GEMINI_API_KEY_8,
    process.env.GEMINI_API_KEY_9,
    process.env.GEMINI_API_KEY_10,
    process.env.GEMINI_API_KEY_NOOR,
    process.env.GEMINI_API_KEY_603,
    process.env.GEMINI_API_KEY_SRISTY,
    process.env.GEMINI_API_KEY_306,
    process.env.GEMINI_API_KEY_MD,
    process.env.GEMINI_API_KEY_306_2,
    process.env.GEMINI_API_KEY_306_3,
    process.env.GEMINI_API_KEY_306_4,
    process.env.GEMINI_API_KEY_306_5,
    process.env.GEMINI_API_KEY_306_6,
    process.env.GEMINI_API_KEY_306_7,
    process.env.GEMINI_API_KEY_306_8,
    process.env.GEMINI_API_KEY_306_9,
    process.env.GEMINI_API_KEY_MD_2,
    process.env.GEMINI_API_KEY_MD_3,
    process.env.GEMINI_API_KEY_MD_4,
    process.env.GEMINI_API_KEY_MD_5,
    process.env.GEMINI_API_KEY_MD_6,
    process.env.GEMINI_API_KEY_MD_7,
    process.env.GEMINI_API_KEY_MD_8,
    process.env.GEMINI_API_KEY_MD_9,
    process.env.GEMINI_API_KEY_MD_10,
    process.env.GEMINI_API_KEY_MD_11,
    process.env.GEMINI_API_KEY_MD_12,
    process.env.GEMINI_API_KEY_MD_13,
    process.env.GEMINI_API_KEY_MD_14,
    process.env.GEMINI_API_KEY_MD_15,
    process.env.GEMINI_API_KEY_MD_16,
    process.env.GEMINI_API_KEY_MD_17,
    process.env.GEMINI_API_KEY_MD_18,
    process.env.GEMINI_API_KEY_MD_19,
    process.env.GEMINI_API_KEY_MD_20,
  ].filter(Boolean);

// ── Bad-key cache with 5-min auto-eviction (handles temp rate limits) ──────
const badKeys = new Map(); // key → expiry timestamp
const BAD_KEY_TTL = 5 * 60 * 1000; // 5 minutes

const isKeyBad = (key) => {
  const exp = badKeys.get(key);
  if (!exp) return false;
  if (Date.now() > exp) { badKeys.delete(key); return false; } // expired
  return true;
};

// ── Timeout Wrapper ──────────────────────────────────────────────────────────
const withTimeout = (promise, ms = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), ms)
    ),
  ]);
};

// ── Safe Text Extractor ──────────────────────────────────────
const extractText = (result) => {
  return (
    result?.text ||
    result?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
};

// ── Core Gemini Caller with Rotation ─────────────────────────
const callGeminiWithRotation = async (prompt) => {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured in .env");
  }

  let lastError;

  for (const key of keys) {
    if (isKeyBad(key)) continue;

    try {
      const ai = new GoogleGenAI({ apiKey: key });

      const result = await withTimeout(
        ai.models.generateContent({
          model: MODEL,
          contents: prompt,
        })
      );

      const text = extractText(result);
      if (!text) throw new Error("Empty response");

      return text;
    } catch (err) {
      console.error(`Gemini key ${key.slice(0, 14)}... failed:`, err.message);
      badKeys.set(key, Date.now() + BAD_KEY_TTL); // evicts after 5 min
      lastError = err;
    }
  }

  throw new Error(
    `All Gemini API keys failed. Last error: ${lastError?.message}`
  );
};

// ── Clean Markdown Fences ────────────────────────────────────
const cleanHTML = (code) => {
  if (!code) return "";
  if (code.startsWith("```")) {
    return code.replace(/^```(html)?\n?/g, "").replace(/\n?```$/g, "").trim();
  }
  return code.trim();
};

// ── Generate Website ─────────────────────────────────────────
export const generateWebsiteCode = async (prompt, theme, type) => {
  const fullPrompt = `
You are an expert frontend web developer specializing in HTML and Tailwind CSS.

Your task is to generate a single, fully functional HTML file.

Requirements:
- Use Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use modern UI/UX design
- Fully responsive
- Include Google Fonts if needed
- Include icons if needed (FontAwesome or Heroicons CDN)
- Ensure all tags are properly closed
- Must include <html>, <head>, and <body>
- No duplicate tags

Return ONLY raw HTML code (no markdown, no explanation).

USER REQUEST:
Create a ${type} with a ${theme} theme.
${prompt}

OUTPUT:
`;

  try {
    const code = await callGeminiWithRotation(fullPrompt);
    return cleanHTML(code);
  } catch (error) {
    console.error("Error generating website code:", error.message);
    throw error;
  }
};

// ── Fix / Update Website ─────────────────────────────────────
export const fixWebsiteCode = async (
  conversation,
  fixRequest,
  currentCode
) => {
  const historyText = conversation
    .map(
      (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
    )
    .join("\n");

  const fullPrompt = `
You are an expert frontend web developer.

Rules:
- Return ONLY full updated HTML (no markdown, no explanation)
- Keep existing functionality unless told otherwise
- Preserve structure unless user asks changes
- Use Tailwind CSS only

CONVERSATION HISTORY:
${historyText || "(none)"}

CURRENT HTML:
${currentCode}

USER REQUEST:
${fixRequest}

OUTPUT:
`;

  try {
    const code = await callGeminiWithRotation(fullPrompt);
    return cleanHTML(code);
  } catch (error) {
    console.error("Error fixing website code:", error.message);
    throw error;
  }
};