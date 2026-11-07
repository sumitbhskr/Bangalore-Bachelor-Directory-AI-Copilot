// Backend/utils/gemini.js
// Thin wrapper over the Gemini REST API using Node's built-in fetch (no SDK).
// Model names come from env so a retired model is a config change, not a code change.

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const cfg = () => ({
  apiKey: (process.env.GEMINI_API_KEY || "").trim(),
  chatModels: [
    process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite",
    process.env.GEMINI_CHAT_FALLBACK_MODEL || "gemini-3.1-flash-lite",
  ],
  embedModel: process.env.GEMINI_EMBED_MODEL || "gemini-embedding-2",
});

const isGeminiConfigured = () => cfg().apiKey.length > 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isTimeout = (err) =>
  err.name === "TimeoutError" || err.name === "AbortError";

// Worth retrying the same model once (temporary problems)
const isTransient = (err) =>
  isTimeout(err) || [429, 500, 502, 503, 504].includes(err.status);

// Worth trying the backup model (model retired, quota hit, empty reply, outage)
const canSwitchModel = (err) =>
  isTransient(err) || err.status === 404 || err.switchable === true;

const callGemini = async (model, method, body, timeoutMs = 15000) => {
  const res = await fetch(`${BASE_URL}/${model}:${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": cfg().apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = (data?.error?.message || "").slice(0, 200);
    } catch {
      // ignore body parse errors
    }
    const err = new Error(
      `Gemini ${model} ${method} failed: HTTP ${res.status} ${detail}`.trim(),
    );
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const withRetry = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && isTransient(err)) {
      await sleep(1000);
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
};

// ── Embeddings ───────────────────────────────────────────
const embedText = async (text) => {
  if (!isGeminiConfigured()) throw new Error("GEMINI_API_KEY is not set");
  const model = cfg().embedModel;
  const data = await withRetry(() =>
    callGemini(model, "embedContent", {
      content: { parts: [{ text: String(text).slice(0, 2000) }] },
    }),
  );
  const values = data?.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`Gemini ${model} returned no embedding values`);
  }
  return values;
};

// ── Text generation (primary model, then backup model) ───
const generateText = async ({
  system,
  prompt,
  maxOutputTokens = 1024,
  temperature = 0.4,
}) => {
  if (!isGeminiConfigured()) throw new Error("GEMINI_API_KEY is not set");

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens, temperature },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };

  let lastErr;
  for (const model of cfg().chatModels) {
    try {
      const data = await withRetry(() =>
        callGemini(model, "generateContent", body),
      );
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const text = parts
        .filter((p) => !p.thought)
        .map((p) => p.text || "")
        .join("")
        .trim();
      if (!text) {
        const err = new Error(
          `Gemini ${model} returned no text (finishReason: ${candidate?.finishReason || "unknown"})`,
        );
        err.switchable = true;
        throw err;
      }
      return text;
    } catch (err) {
      lastErr = err;
      console.error(`[gemini] ${err.message}`);
      if (!canSwitchModel(err)) throw err; // 400/401/403 = config problem, backup won't help
    }
  }
  throw lastErr;
};

module.exports = { isGeminiConfigured, embedText, generateText };
