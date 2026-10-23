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

  const handleFilterClick = (slug: string) => {
    setMobileOpen(false);
    setCatOpen(false);

    // کیٹلاگ سیکشن تک ہموار سکرول
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }

    // کیٹلاگ کو فوری فلٹر ایونٹ بھیجنا
    window.dispatchEvent(
      new CustomEvent("nexura:filter", { detail: slug })
    );
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 ${
        scrolled ? "bg-obsidian/95 backdrop-blur-md border-b border-frost/10" : "bg-obsidian/60 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-5 lg:px-10 py-4 lg:py-5">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="lg:hidden text-frost cursor-pointer"
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

        {/* Center: Desktop Navigation (Kids, Women, Men) */}
        <nav className="hidden lg:flex items-center gap-7">
          {CATEGORIES.slice(1, 4).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => handleFilterClick(c.slug)}
              className="text-[11px] tracking-[0.2em] uppercase text-frost/80 hover:text-frost font-medium transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              {c.label}
            </button>
          ))}

          {/* More Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-frost/80 hover:text-frost font-medium transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              More
              <ChevronDown size={13} className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 w-56 bg-[#0e1015] border border-frost/20 py-2 shadow-2xl rounded-sm">
                  {CATEGORIES.slice(4).map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleFilterClick(c.slug)}
                      className="block w-full text-left px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-frost/70 hover:text-gold hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right: Shop All + Currency */}
        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
          <button
            type="button"
            onClick={() => handleFilterClick("all")}
            className="hidden lg:block text-[11px] tracking-[0.2em] uppercase text-frost/80 hover:text-frost transition-colors whitespace-nowrap cursor-pointer"
          >
            Shop All
          </button>
          <CurrencySwitcher />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#0e1015] border-r border-frost/10 p-6">
            <div className="flex items-center justify-between mb-10">
              <span className="font-display text-xl tracking-[0.3em] text-frost font-bold pl-[0.3em]">NEXURA</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-frost/70 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleFilterClick(c.slug)}
                  className="text-left text-xs tracking-[0.2em] uppercase text-frost/70 hover:text-gold transition-colors cursor-pointer py-1"
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
