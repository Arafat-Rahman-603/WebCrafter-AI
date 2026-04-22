import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// ── Key Pool (rotation) ───────────────────────────────────────────────────────
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
  process.env.GEMINI_API_KEY_11,
  process.env.GEMINI_API_KEY_12,
  process.env.GEMINI_API_KEY_13,
  process.env.GEMINI_API_KEY_14,
  process.env.GEMINI_API_KEY_15,
  process.env.GEMINI_API_KEY_16,
  process.env.GEMINI_API_KEY_17,
  process.env.GEMINI_API_KEY_18,
  process.env.GEMINI_API_KEY_19,
  process.env.GEMINI_API_KEY_20,
  process.env.GEMINI_API_KEY_21,
  process.env.GEMINI_API_KEY_22,
  process.env.GEMINI_API_KEY_23,
  process.env.GEMINI_API_KEY_24,
  process.env.GEMINI_API_KEY_25,
  process.env.GEMINI_API_KEY_26,
  process.env.GEMINI_API_KEY_27,
  process.env.GEMINI_API_KEY_28,
  process.env.GEMINI_API_KEY_29,
  process.env.GEMINI_API_KEY_30,
  process.env.GEMINI_API_KEY_31,
  process.env.GEMINI_API_KEY_32,

].filter(Boolean);

const MODEL_NAME = "gemini-2.5-flash";

let currentKeyIndex = 0;

// ── Core Gemini Caller with Key Rotation ─────────────────────────────────────
const callGemini = async (prompt) => {
  if (GEMINI_KEYS.length === 0) {
    throw new Error("No Gemini API keys configured in .env");
  }

  let attempts = 0;

  while (attempts < GEMINI_KEYS.length) {
    const apiKey = GEMINI_KEYS[currentKeyIndex];

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();

      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (error) {
      const msg = error?.message || "";
      const status = error?.status;

      // Rotate key on quota, rate-limit, OR service unavailable errors
      const shouldRotate =
        status === 429 ||
        status === 503 ||
        msg.includes("429") ||
        msg.includes("503") ||
        msg.includes("quota") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("rate limit") ||
        msg.includes("Service Unavailable") ||
        msg.includes("high demand");

      if (shouldRotate) {
        console.warn(
          `[Gemini] Key #${currentKeyIndex} failed (${status || msg.slice(0, 60)}) — rotating to next key`
        );
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
        attempts++;
        continue;
      }

      // Non-retryable error — throw immediately
      throw error;
    }
  }

  throw new Error("All Gemini API keys are exhausted. Please try again later.");
};

// ── Clean Markdown Fences ─────────────────────────────────────────────────────
const cleanHTML = (code) => {
  if (!code) return "";
  return code
    .replace(/^```(html)?\n?/i, "")
    .replace(/\n?```\s*$/g, "")
    .trim();
};

// ── Generate Website ──────────────────────────────────────────────────────────
export const generateWebsiteCode = async (prompt, theme, type) => {
  const fullPrompt = `
You are an expert frontend web developer specializing in HTML and Tailwind CSS.

Your task is to generate a single, fully functional HTML file.

Requirements:
- Use Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use modern UI/UX design
- Fully responsive
- Include Google Fonts if needed
- Include icons if needed (FontAwesome CDN)
- Ensure all tags are properly closed
- Must include <html>, <head>, and <body>
- No duplicate tags
- Use javascript for add functionalites
- use images from unsplash https://unsplash.com

Return ONLY raw HTML code. No markdown code blocks, no explanation, no comments outside HTML.

USER REQUEST:
Create a ${type} with a ${theme} theme.
${prompt}

OUTPUT:
`;

  try {
    const code = await callGemini(fullPrompt);
    return cleanHTML(code);
  } catch (error) {
    console.error("Error generating website code:", error.message);
    throw error;
  }
};

// ── Fix / Update Website ──────────────────────────────────────────────────────
export const fixWebsiteCode = async (conversation, fixRequest, currentCode) => {
  const historyText = conversation
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `
You are an expert frontend web developer.

Rules:
- Return ONLY the full updated HTML (no markdown, no explanation)
- Keep existing functionality unless told otherwise
- Preserve structure unless the user asks for changes
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
    const code = await callGemini(fullPrompt);
    return cleanHTML(code);
  } catch (error) {
    console.error("Error fixing website code:", error.message);
    throw error;
  }
};