import React, { useState, useRef, useEffect } from "react";
import { askGeminiSalesman } from "../lib/gemini";
import { Product } from "../lib/types";

interface Props {
  products: Product[];
}

interface Message {
  role: "user" | "model";
  text: string;
}

export default function GeminiChatbot({ products }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Assalam-o-Alaikum! Main NEXURA ka AI Fashion Stylist hoon. Sizing, jackets, unstitched suits aur COD delivery ke mutaliq sawal puchein!"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // کارڈ کے "Ask AI Salesman" بٹن پر کلک ہوتے ہی بوٹ کو خود کھولنا
  useEffect(() => {
    const handleCustomOpen = (event: any) => {
      setIsOpen(true);
      if (event.detail?.productName) {
        const itemQuery = `Mujhe "${event.detail.productName}" (${event.detail.price}) ke size aur quality ke bare mein advise karein.`;
        handleCustomSend(itemQuery);
      }
    };

    window.addEventListener("open-nexura-ai", handleCustomOpen);
    return () => window.removeEventListener("open-nexura-ai", handleCustomOpen);
  }, [messages, products]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleCustomSend = async (userText: string) => {
    const newHistory: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(newHistory);
    setLoading(true);

    const aiReply = await askGeminiSalesman(userText, newHistory, products);
    setMessages([...newHistory, { role: "model", text: aiReply }]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    await handleCustomSend(userText);
  };

  return (
    <>
      {/* لگژری گولڈن فلوٹنگ بٹن - بائیں کونے میں */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 bg-[#121212] border-2 border-[#c5a880] text-[#c5a880] hover:bg-[#c5a880] hover:text-black font-bold p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="NEXURA AI Stylist"
      >
        <span className="text-lg">✨</span>
        <span className="text-xs font-mono font-bold tracking-widest uppercase hidden sm:inline">
          AI Stylist
        </span>
      </button>

      {/* چیٹ ونڈو */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] sm:w-[380px] bg-[#121212] border border-[#c5a880]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[520px] max-h-[82vh] backdrop-blur-xl">
          <div className="bg-[#181818] border-b border-white/10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#c5a880] text-black flex items-center justify-center text-sm font-bold shadow">
                ✨
              </span>
              <div>
                <h4 className="text-xs font-bold text-frost tracking-wider uppercase font-display flex items-center gap-1.5">
                  NEXURA AI Stylist
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h4>
                <p className="text-[9px] text-[#c5a880] font-mono">Personal Sales & Size Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-frost/50 hover:text-white text-base p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Quick FAQ Pills */}
          <div className="p-2 bg-black/40 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => { setInput("Mera height 5'10 aur weight 75kg hai, kaunsa size sahi rahega?"); }}
              className="bg-white/5 hover:bg-[#c5a880]/20 text-frost/80 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/5 cursor-pointer"
            >
              📏 Size Help
            </button>
            <button
              onClick={() => { setInput("Unstitched men winter suits ki fabric aur quality kaisi hai?"); }}
              className="bg-white/5 hover:bg-[#c5a880]/20 text-frost/80 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/5 cursor-pointer"
            >
              👔 Unstitched Suits
            </button>
            <button
              onClick={() => { setInput("COD delivery charges aur return replacement policy kya hai?"); }}
              className="bg-white/5 hover:bg-[#c5a880]/20 text-frost/80 px-2.5 py-1 rounded-full whitespace-nowrap border border-white/5 cursor-pointer"
            >
              🚚 COD & Policy
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[84%] p-3 rounded-xl ${
                    m.role === "user"
                      ? "bg-[#c5a880] text-black font-medium rounded-br-none shadow"
                      : "bg-white/5 border border-white/10 text-frost rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-[#c5a880] p-3 rounded-xl text-[11px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.4s]"></span>
                  <span>AI سوچ رہا ہے...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#181818] border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Sawal puchein (e.g. Size, Jackets, Suits)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-frost outline-none focus:border-[#c5a880] transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-[#c5a880] hover:bg-[#d6bc96] text-black font-bold px-3 py-2 rounded-lg text-xs tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
