import { ArrowDown } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/types";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100vh] w-full overflow-hidden flex items-center pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/15536344/pexels-photo-15536344.jpeg?auto=compress&cs=tinysrgb&h=1400"
          alt="NEXURA winter editorial"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/40 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full py-20">
        <p className="section-label animate-fade-up mb-6 text-gold">Winter Collection 2026</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-frost leading-[1.05] max-w-4xl animate-fade-up" style={{ animationDelay: "0.15s" }}>
          Engineered for
          <br />
          the Extreme Cold
        </h1>
        <p className="mt-8 max-w-xl text-sm md:text-base text-frost/70 leading-relaxed animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Ultra-luxury winter outerwear and garments. Arctic-grade parkas, premium down puffers, heavyweight hoodies, and cashmere knits — crafted for those who refuse to compromise.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: "0.45s" }}>
          <button
            onClick={() => {
              const el = document.getElementById("catalog");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary"
          >
            Explore the Drop
          </button>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Order via WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <span className="text-[9px] tracking-[0.3em] uppercase text-frost/40">Scroll</span>
        <ArrowDown size={14} className="text-frost/40 animate-bounce" />
      </div>
    </section>
  );
}
