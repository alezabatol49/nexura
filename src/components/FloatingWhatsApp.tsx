import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { WHATSAPP_LINK } from "../lib/types";

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#1f7a4d] text-white pl-4 pr-5 py-4 shadow-2xl shadow-black/40 transition-all duration-300 hover:bg-[#176b40] group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} className="shrink-0" fill="currentColor" stroke="none" />
      <span className={`text-xs tracking-widest uppercase whitespace-nowrap overflow-hidden transition-all duration-300 ${hovered ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}>
        Chat with us
      </span>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
    </a>
  );
}
