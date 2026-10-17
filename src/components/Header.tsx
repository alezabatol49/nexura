import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import CurrencySwitcher from "./CurrencySwitcher";
import { CATEGORIES } from "../lib/types";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (slug: string) => {
    setMobileOpen(false);
    setCatOpen(false);
    const el = document.getElementById(`catalog`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("nexura:filter", { detail: slug }));
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 ${
        scrolled ? "bg-obsidian/95 backdrop-blur-md border-b border-frost/10" : "bg-obsidian/60 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-5 lg:px-10 py-4 lg:py-5">
        {/* Left: logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="lg:hidden text-frost"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <a href="#top" className="block">
            <span className="font-display text-xl lg:text-2xl tracking-[0.3em] text-frost font-bold pl-[0.3em]">
              NEXURA
            </span>
          </a>
        </div>

        {/* Center: nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {CATEGORIES.slice(1, 5).map((c) => (
            <button
              key={c.slug}
              onClick={() => scrollTo(c.slug)}
              className="text-[11px] tracking-[0.2em] uppercase text-frost/70 hover:text-frost transition-colors whitespace-nowrap"
            >
              {c.label}
            </button>
          ))}
          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-frost/70 hover:text-frost transition-colors whitespace-nowrap"
            >
              More
              <ChevronDown size={12} className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 w-52 bg-obsidian-50 border border-frost/10 py-2 animate-fade-in">
                  {CATEGORIES.slice(5).map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => scrollTo(c.slug)}
                      className="block w-full text-left px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase text-frost/70 hover:text-gold hover:bg-frost/5 transition-colors"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right: shop all + currency */}
        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
          <button
            onClick={() => scrollTo("all")}
            className="hidden lg:block text-[11px] tracking-[0.2em] uppercase text-frost/70 hover:text-frost transition-colors whitespace-nowrap"
          >
            Shop All
          </button>
          <CurrencySwitcher />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-obsidian-100 border-r border-frost/10 p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-10">
              <span className="font-display text-xl tracking-[0.3em] text-frost font-bold pl-[0.3em]">NEXURA</span>
              <button onClick={() => setMobileOpen(false)} className="text-frost/70">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => scrollTo(c.slug)}
                  className="text-left text-xs tracking-[0.2em] uppercase text-frost/70 hover:text-gold transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
