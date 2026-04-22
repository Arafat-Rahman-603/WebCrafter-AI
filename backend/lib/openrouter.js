import dotenv from "dotenv";
dotenv.config();

// ── Configuration ─────────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "inclusionai/ling-2.6-flash:free";
const REQUEST_TIMEOUT_MS = 120_000; // 2 minutes
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 2_000;

if (!OPENROUTER_API_KEY) {
  console.error("[OpenRouter] ⚠ No OPENROUTER_API_KEY found in .env");
} else {
  console.log(`[OpenRouter] API key loaded — using model: ${MODEL}`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const backoffWithJitter = (attempt) => {
  const base = BASE_BACKOFF_MS * Math.pow(2, attempt);
  const jitter = Math.random() * base * 0.3;
  return Math.min(base + jitter, 15_000);
};

const isRetryableStatus = (status) =>
  status === 429 || status === 500 || status === 502 || status === 503 || status === 504;

// ── Core OpenRouter Caller with Retry ─────────────────────────────────────────
const callAI = async (prompt) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured in .env");
  }

  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "WebCrafter AI", 
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 16000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle HTTP-level errors
      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const errMsg = `HTTP ${response.status}: ${errorBody.slice(0, 200)}`;

        if (isRetryableStatus(response.status)) {
          console.warn(
            `[OpenRouter] Attempt ${attempt + 1}/${MAX_RETRIES} failed — ${errMsg}`
          );
          lastError = new Error(errMsg);
          const delay = backoffWithJitter(attempt);
          console.log(`[OpenRouter] Retrying in ${Math.round(delay)}ms…`);
          await sleep(delay);
          continue;
        }

        // Non-retryable HTTP error
        throw new Error(errMsg);
      }

      const data = await response.json();

      // Check for API-level errors
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }

      const text = data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("Empty response from OpenRouter");
      }

      return text;
    } catch (error) {
      lastError = error;

      // Retry on abort (timeout) or network errors
      if (
        error.name === "AbortError" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT"
      ) {
        console.warn(
          `[OpenRouter] Attempt ${attempt + 1}/${MAX_RETRIES} — ${error.message}`
        );
        const delay = backoffWithJitter(attempt);
        await sleep(delay);
        continue;
      }

      // Non-retryable — throw immediately
      throw error;
    }
  }

  throw new Error(
    `OpenRouter failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message || "Unknown"}`
  );
};

// ── Clean Markdown Fences ─────────────────────────────────────────────────────
const cleanHTML = (code) => {
  if (!code) return "";
  return code
    .replace(/^```(?:html|HTML)?\s*\n?/i, "")
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
    const code = await callAI(fullPrompt);
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
    const code = await callAI(fullPrompt);
    return cleanHTML(code);
  } catch (error) {
    console.error("Error fixing website code:", error.message);
    throw error;
  }
};