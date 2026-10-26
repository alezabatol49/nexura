import React from "react";
import { useCart } from "../lib/CartContext";
import { useCurrency } from "../lib/CurrencyContext";

export default function Header() {
  const { totalCount, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur border-b border-[#c5a880]/20 px-4 md:px-10 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-[#c5a880] group-hover:text-white transition-colors">
            NEXURA
          </span>
        </a>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-frost/70 font-medium">
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">All Collections</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Parkas & Puffer</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Hoodies</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Family & Kids</a>
        </nav>

        {/* Right Actions: Search + Currency + Cart */}
        <div className="flex items-center gap-4">
          
          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              const catalogSection = document.getElementById("catalog");
              if (catalogSection) {
                catalogSection.scrollIntoView({ behavior: "smooth" });
                const searchInput = document.querySelector("#catalog input") as HTMLInputElement;
                if (searchInput) searchInput.focus();
              }
            }}
            className="p-2 text-frost/70 hover:text-[#c5a880] transition-colors cursor-pointer"
            title="Search Garments"
            aria-label="Search Garments"
          >
            <span className="text-lg">🔍</span>
          </button>

          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-neutral-900 border border-white/10 text-frost text-[10px] tracking-wider uppercase px-2 py-1.5 rounded outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="PKR">PKR (Rs)</option>
            <option value="USD">USD ($)</option>
          </select>

          {/* Shopping Cart Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-frost hover:text-[#c5a880] transition-all cursor-pointer bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:border-[#c5a880]"
            title="Open Shopping Bag"
            aria-label="Open Shopping Bag"
          >
            <span className="text-lg">🛍️</span>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c5a880] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono shadow">
                {totalCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
