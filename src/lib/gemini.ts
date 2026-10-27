import { Product } from "./types";

const GEMINI_API_KEY = "AQ.Ab8RN6I_PSZh_3aGfTqOMCswLOqqibIwHq-FGKhVuho3SmCgfw";

export async function askGeminiSalesman(
  userMessage: string,
  chatHistory: { role: "user" | "model"; text: string }[],
  availableProducts: Product[]
): Promise<string> {
  const productContext = availableProducts.slice(0, 20).map(p => 
    `- ${p.name} | Category: ${p.category} | Price: Rs. ${p.price_pkr} | Sizes: ${p.sizes?.join(", ") || "Standard"}`
  ).join("\n");

  const systemInstruction = 
    "You are NEXURA AI Stylist and Salesman for NEXURA.PK luxury winter wear and garments in Pakistan. " +
    "STRICT RULE: Only talk about NEXURA clothes, hoodies, jackets, sizes, delivery (3-5 days nationwide COD), 20% off code NEXURA20, and WhatsApp helpline 03219404812. " +
    "If the customer asks about real estate, plots, or files, politely inform them that you are only a fashion stylist for NEXURA garments, and for real estate they can contact Bin Taha Associates separately. " +
    "Speak in polite, helpful Roman Urdu or Urdu. " +
    "Available items: " + productContext;

  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "جی محترم! میں NEXURA سے ہوں۔ ونٹر کلیکشن میں آپ کو کس سائز یا ورائٹی کی تلاش ہے؟";
  } catch (error) {
    return "معذرت، اس وقت سرور مصروف ہے۔ آپ واٹس ایپ نمبر 03219404812 پر براہِ راست رابطہ کر سکتے ہیں!";
  }
}
