import React, { useState } from "react";
import { useCart } from "../lib/CartContext";
import { useCurrency } from "../lib/CurrencyContext";

interface Props {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function Header({ searchQuery = "", setSearchQuery }: Props) {
  const { totalCount, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur border-b border-[#c5a880]/20 px-4 md:px-10 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo with Red .PK Badge */}
        <a href="/" className="flex items-end gap-1 group shrink-0">
          <span className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-[#c5a880] group-hover:text-white transition-colors leading-none">
            NEXURA
          </span>
          <span className="text-[10px] md:text-xs font-bold text-red-500 font-mono tracking-tight pb-0.5">
            .PK
          </span>
        </a>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] text-frost/70 font-medium">
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">All Collections</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Parkas & Puffer</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Hoodies</a>
          <a href="#catalog" className="hover:text-[#c5a880] transition-colors">Family & Kids</a>
        </nav>

        {/* Right Actions: Interactive Search + Currency + Shopping Cart */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          
          {/* 1. Real-time Search Box */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-[#181818] border border-[#c5a880]/50 rounded-full px-3 py-1 shadow-lg animate-fadeIn">
                <input
                  type="text"
                  placeholder="Search 1,500+ items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-frost outline-none w-32 sm:w-48 placeholder:text-frost/30"
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="text-frost/50 hover:text-white text-xs ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowSearchInput(true);
                  const catalog = document.getElementById("catalog");
                  if (catalog) catalog.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-2 text-frost/80 hover:text-[#c5a880] transition-colors cursor-pointer"
                title="Search Products"
              >
                <span className="text-base sm:text-lg">🔍</span>
              </button>
            )}
          </div>

          {/* 2. Currency Selector (Default PKR) */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-neutral-900 border border-white/10 text-frost text-[10px] tracking-wider uppercase px-2 py-1.5 rounded outline-none focus:border-[#c5a880] cursor-pointer"
          >
            <option value="PKR">PKR (Rs)</option>
            <option value="USD">USD ($)</option>
          </select>

          {/* 3. Shopping Cart Drawer Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-frost hover:text-[#c5a880] transition-all cursor-pointer bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:border-[#c5a880]"
            title="Open Shopping Bag"
          >
            <span className="text-base sm:text-lg">🛍️</span>
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
