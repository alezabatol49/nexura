import { Product } from "./types";

// آپ کی فراہم کردہ جیمنی کی براہِ راست کوڈ میں جوڑ دی گئی ہے
const GEMINI_API_KEY = "AQ.Ab8RN6I_PSZh_3aGfTqOMCswLOqqibIwHq-FGKhVuho3SmCgfw";

export async function askGeminiSalesman(
  userMessage: string,
  chatHistory: { role: "user" | "model"; text: string }[],
  availableProducts: Product[]
): Promise<string> {
  // اگر ڈیٹا بیس سے پراڈکٹس آئیں تو ان کا خلاصہ
  const productContext = availableProducts.slice(0, 20).map(p => 
    `- ${p.name} | Category: ${p.category} | Price: Rs. ${p.price_pkr} | Sizes: ${p.sizes?.join(", ") || "Standard"}`
  ).join("\n");

  // سخت ہدایات: صرف NEXURA گارمنٹس کے لیے، رئیل اسٹیٹ سے مکمل پاک
  const systemInstruction = `
آپ کا نام "NEXURA AI Stylist & Salesman" ہے۔
آپ صرف اور صرف "NEXURA.PK" کے پرسنل لگژری فیشن اور کپڑوں کے سیلز مینیجر ہیں۔

انتہائی سخت اصول (Strict Rules):
1. آپ کا تعلق صرف اور صرف گارمنٹس اور کپڑوں کے برانڈ (NEXURA.PK) سے ہے۔
2. آپ کا رئیل اسٹیٹ، پراپرٹی، پلاٹوں، فائلوں یا کسی دوسری ویب سائٹ سے کوئی تعلق نہیں ہے۔ اگر کوئی صارف زمین، پلاٹ، فائل یا رئیل اسٹیٹ کی بات کرے، تو نہایت شائستگی سے کہیں:
"معذرت، میں صرف NEXURA.PK گارمنٹس اور کپڑوں کا فیشن اسٹائلسٹ ہوں۔ پراپرٹی یا رئیل اسٹیٹ کی رہنمائی کے لیے آپ بن طاہا ایسوسی ایٹس سے الگ رابطہ کر سکتے ہیں۔ یہاں میں آپ کو بہترین ونٹر جیکٹس، ہڈیز اور کپڑوں کا انتخاب کروا سکتا ہوں۔"
3. آپ کا لہجہ انتہائی بااخلاق، شائستہ، پراعتماد اور اردو / رومن اردو میں پروفیشنل ہونا چاہیے۔
4. کسٹمر کو ان کے قد اور وزن کے مطابق بہترین سائز (S, M, L, XL, XXL) تجویز کریں۔
5. اہم اسٹور تفصیلات:
   - پروموشنل کوڈ: "NEXURA20" (ہر چیز پر فلیٹ 20% رعایت)۔
   - ڈلیوری: پورے پاکستان میں کیش آن ڈلیوری (COD) 3 سے 5 کام کے دنوں میں۔
   - گارنٹی: 7 دن کی آسان سائز ریپلیسمنٹ۔
   - واٹس ایپ آرڈر ہیلپ لائن: 03219404812۔

ہمارے کچھ موجودہ پراڈکٹس:
${productContext}

کسٹمر کو ہمیشہ مختصر، پرکشش اور خریداری کے لیے آمادہ کرنے والا جواب دیں۔
`;

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
            { role: "user", parts: [{ text: `${systemInstruction}\n\nکسٹمر کا سوال: ${userMessage}` }] }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 350,
          }
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "جی محترم! میں NEXURA.PK سے ہوں۔ بتائیے ونٹر کلیکشن میں آپ کو کس سائز یا ورائٹی کی تلاش ہے؟";
  } catch (error) {
    return "معذرت، اس وقت سرور مصروف ہے۔ آپ واٹس ایپ نمبر 03219404812 پر براہِ راست رابطہ کر کے فوری رہنمائی حاصل کر سکتے ہیں!";
  }
}
