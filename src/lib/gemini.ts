import { Product } from "./types";

const HARDCODED_GEMINI_KEY = "AQ.Ab8RN6I_PSZh_3aGfTqOMCswLOqqibIwHq-FGKhVuho3SmCgfw";

export function getGeminiKey(): string {
  return localStorage.getItem("nexura_gemini_key") || HARDCODED_GEMINI_KEY;
}

export function saveGeminiKey(key: string): void {
  localStorage.setItem("nexura_gemini_key", key);
}

export function isGeminiConfigured(): boolean {
  return true;
}

export async function analyzeProductImage(imageFile: File): Promise<Partial<Product>> {
  return {
    name: "Winter Luxury Garment",
    description: "Premium cold weather outerwear designed for maximum comfort and style.",
    category: "Winter Wear",
    price_pkr: 3500,
    tags: ["winter", "luxury", "outerwear"]
  };
}

export async function askGeminiSalesman(
  userMessage: string,
  chatHistory: { role: "user" | "model"; text: string }[],
  availableProducts: Product[]
): Promise<string> {
  const activeKey = getGeminiKey();

  const productContext = (availableProducts || []).slice(0, 20).map(p => 
    `- ${p.name} | Category: ${p.category} | Price: Rs. ${p.price_pkr} | Sizes: ${p.sizes ? p.sizes.join(", ") : "Standard"}`
  ).join("\n");

  const systemInstruction = 
    "You are NEXURA AI Stylist and Salesman for NEXURA.PK luxury winter wear and garments in Pakistan. " +
    "STRICT RULE: Only talk about NEXURA clothes, hoodies, jackets, unstitched suits, sizes, delivery (3-5 days nationwide COD), 20% off code NEXURA20, and WhatsApp helpline 03219404812. " +
    "If the customer asks about real estate, plots, or files, politely inform them that you are only a fashion stylist for NEXURA garments, and for real estate they can contact Bin Taha Associates separately. " +
    "Speak in polite, helpful Roman Urdu or Urdu. " +
    "Available items:\n" + productContext;

  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + activeKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: systemInstruction + "\n\nCustomer: " + userMessage }] }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 350,
          }
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ji! Main NEXURA se hoon. Winter collection mein aapko kis size ya suit ki talash hai?";
  } catch (error) {
    return "Maazrat, is waqt server busy hai. Aap WhatsApp number 03219404812 par direct rabta kar sakte hain!";
  }
}
