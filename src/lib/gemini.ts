export type GeminiResult = {
  name: string;
  category: string;
  description: string;
  sizes: string[];
  compareAtPrice: number;
};

const GEMINI_API_KEY = "AQ.Ab8RN6I_PSZh_3aGfTqOMCswLOqqibIwHq-FGKhVuho3SmCgfw";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const STORAGE_KEY = "nexura-gemini-key";

export function getGeminiKey(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || GEMINI_API_KEY;
  } catch {
    return GEMINI_API_KEY;
  }
}

export function saveGeminiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function isGeminiConfigured(): boolean {
  return getGeminiKey().trim().length > 0;
}

const CATEGORY_MAP: Record<string, string> = {
  "puffer jackets": "puffer-jackets",
  "puffer jacket": "puffer-jackets",
  "arctic parkas": "arctic-parkas",
  "arctic parka": "arctic-parkas",
  "heavyweight hoodies": "hoodies",
  "heavyweight hoodie": "hoodies",
  "hoodies": "hoodies",
  "hoodie": "hoodies",
  "cashmere sweaters": "cashmere-sweaters",
  "cashmere sweater": "cashmere-sweaters",
  "sweaters": "cashmere-sweaters",
  "sweater": "cashmere-sweaters",
  "accessories": "gloves",
  "accessory": "gloves",
  "gloves": "gloves",
  "glove": "gloves",
  "thermal socks": "thermal-socks",
  "socks": "thermal-socks",
  "balaclavas": "balaclavas",
  "balaclava": "balaclavas",
};

function mapCategory(raw: string): string {
  const lower = raw.trim().toLowerCase();
  return CATEGORY_MAP[lower] ?? "puffer-jackets";
}

/**
 * Sends a product image (base64) to Gemini Flash and returns AI-generated
 * product metadata: name, category, description, sizes, and compare-at price.
 */
export async function analyzeProductImage(
  base64DataUrl: string,
  salePrice: number
): Promise<GeminiResult> {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Gemini API key not configured");

  // Parse the data URL: data:image/jpeg;base64,....
  const match = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");
  const mimeType = match[1];
  const base64Data = match[2];

  const prompt = `You are an expert luxury outerwear copywriter for NEXURA brand. Examine this garment photo and output only raw JSON without backticks:
{
  "name": "Luxury product title matching NEXURA aesthetic",
  "category": "Choose closest: Puffer Jackets | Arctic Parkas | Heavyweight Hoodies | Cashmere Sweaters | Accessories",
  "description": "2-3 punchy luxury sentences highlighting extreme cold protection, premium fabric, and modern silhouette",
  "sizes": ["S", "M", "L", "XL"],
  "compareAtPrice": ${Math.round(salePrice * 1.25 / 50) * 50}
}

The sale price is ${salePrice} PKR. Set compareAtPrice to ${Math.round(salePrice * 1.25 / 50) * 50} (sale price * 1.25 rounded to nearest 50). Output ONLY the JSON object, no markdown, no backticks, no explanation.`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    let msg = `Gemini API error (${res.status})`;
    try {
      const errJson = JSON.parse(errText);
      if (errJson?.error?.message) msg = errJson.error.message;
    } catch {
      if (errText) msg += `: ${errText.slice(0, 120)}`;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");

  // Strip markdown fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from the text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse Gemini response as JSON");
    parsed = JSON.parse(jsonMatch[0]);
  }

  const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
  const category = typeof parsed.category === "string" ? mapCategory(parsed.category) : "puffer-jackets";
  const description = typeof parsed.description === "string" ? parsed.description.trim() : "";
  const rawSizes = Array.isArray(parsed.sizes) ? parsed.sizes : ["S", "M", "L", "XL"];
  const sizes = rawSizes.filter((s): s is string => typeof s === "string").map((s) => s.trim().toUpperCase()).filter((s) => s.length > 0);
  const compareAtPrice = typeof parsed.compareAtPrice === "number"
    ? parsed.compareAtPrice
    : Math.round(salePrice * 1.25 / 50) * 50;

  if (!name) throw new Error("Gemini did not return a product name");

  return {
    name,
    category,
    description,
    sizes: sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
    compareAtPrice,
  };
}
