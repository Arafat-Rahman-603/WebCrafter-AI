import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

// ── Model cascade: try these in order when all keys fail on one model ─────────
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

// ── Key rotation pool — all keys tried in order until one works ───────────────
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

/**
 * Try every key on every model in cascade until one succeeds.
 * Order: gemini-2.0-flash → gemini-2.5-flash → gemini-1.5-flash → gemini-1.5-pro
 * Within each model all keys are tried before moving to the next model.
 */
const callGeminiWithRotation = async (prompt) => {
  const keys = getApiKeys();
  if (keys.length === 0) throw new Error("No Gemini API keys configured in .env");

  let lastError;

  for (const model of MODELS) {
    for (const key of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const result = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        console.log(`✅ Gemini success — model: ${model}, key: ${key.slice(0, 12)}…`);
        return result.text;
      } catch (err) {
        const status = err?.status || err?.message || "";
        // 429 = rate limited, 503 = overloaded — both are retriable with next key/model
        const isRetriable = status === 429 || status === 503
          || String(err).includes("429") || String(err).includes("503")
          || String(err).includes("RESOURCE_EXHAUSTED") || String(err).includes("UNAVAILABLE");

        console.warn(`⚠ ${model} / ${key.slice(0, 12)}… → ${isRetriable ? "rate-limited, skipping" : err.message}`);
        lastError = err;
        continue;
      }
    }
    console.warn(`All keys exhausted for model ${model}, trying next model…`);
  }

  throw new Error(
    `All Gemini models and keys failed. Last error: ${lastError?.message || lastError}`
  );
};

/**
 * Generate a brand-new website from user prompt + theme + type.
 */
export const generateWebsiteCode = async (prompt, theme, type) => {
  const fullPrompt = `You are an expert frontend web developer specializing in HTML and Tailwind CSS.
Your task is to generate a single, completely functional HTML file containing a ${type} using the ${theme} theme.

Requirements:
- Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>).
- Include any necessary icons (e.g., FontAwesome or Heroicons via CDN).
- Include any necessary Google Fonts.
- Ensure the design is responsive and modern.
- Only return the raw HTML code, without any markdown formatting, code fences, or explanations.

USER REQUEST:
Create a ${type} with a ${theme} theme. ${prompt}

RESPONSE (raw HTML only):`;

  try {
    let code = await callGeminiWithRotation(fullPrompt);

    // Strip markdown fences if the model adds them anyway
    if (code.startsWith("```")) {
      code = code.replace(/^```(html)?\n?/g, "").replace(/\n?```$/g, "");
    }

    return code.trim();
  } catch (error) {
    console.error("Error generating website code:", error);
    throw error;
  }
};

/**
 * Fix / update existing website code based on a user chat message.
 * @param {Array}  conversation - existing [{role, content}] history
 * @param {string} fixRequest   - the user's new fix/change request
 * @param {string} currentCode  - the current full HTML code
 * @returns {string} updated full HTML code
 */
export const fixWebsiteCode = async (conversation, fixRequest, currentCode) => {
  // Build conversation history as a readable string for the prompt
  const historyText = conversation
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `You are an expert frontend web developer. The user has an existing HTML website and wants to make changes to it.

Rules:
- Return ONLY the complete, updated HTML file. No explanations, no markdown, no code fences.
- Keep all existing functionality unless explicitly asked to remove it.
- Preserve the overall design and structure unless the user asks to change it.
- Use Tailwind CSS (already loaded via CDN) for any styling additions.

CONVERSATION HISTORY:
${historyText || "(No prior conversation)"}

CURRENT HTML CODE:
${currentCode}

USER FIX REQUEST:
${fixRequest}

RESPONSE (updated raw HTML only):`;

  try {
    let code = await callGeminiWithRotation(fullPrompt);

    // Strip markdown fences if present
    if (code.startsWith("```")) {
      code = code.replace(/^```(html)?\n?/g, "").replace(/\n?```$/g, "");
    }

    return code.trim();
  } catch (error) {
    console.error("Error fixing website code:", error);
    throw error;
  }
};
