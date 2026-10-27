import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] border-t border-[#c5a880]/20 text-frost/80 pt-16 pb-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.25em] text-[#c5a880] font-bold">NEXURA</h2>
          <p className="text-xs text-frost/60 leading-relaxed font-light">
            Pakistan's ultra-luxury outerwear & garments brand. Designed for cold comfort, refined styling, and unmatched longevity.
          </p>
          <div className="text-[11px] text-[#c5a880] font-mono">
            Direct Support: 0321-9404812
          </div>
        </div>

        {/* Col 2: Fast Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-semibold">Collections</h3>
          <ul className="text-xs space-y-2 text-frost/60">
            <li><a href="#catalog" className="hover:text-[#c5a880] transition-colors">Arctic Parkas & Puffer</a></li>
            <li><a href="#catalog" className="hover:text-[#c5a880] transition-colors">Heavyweight Hoodies</a></li>
            <li><a href="#catalog" className="hover:text-[#c5a880] transition-colors">Cashmere Sweaters</a></li>
            <li><a href="#catalog" className="hover:text-[#c5a880] transition-colors">Balaclavas & Gloves</a></li>
            <li><a href="#catalog" className="hover:text-[#c5a880] transition-colors">Family & Kids Winterwear</a></li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Policy */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-semibold">Trust & Assurance</h3>
          <ul className="text-xs space-y-2 text-frost/60">
            <li>🚚 Nationwide Cash on Delivery (COD)</li>
            <li>⏱️ 3 to 5 Working Days Delivery</li>
            <li>🔄 7-Day Hassle-Free Replacement</li>
            <li>✨ 100% Inspected Fabric Quality</li>
            <li>💬 24/7 WhatsApp Order Helpline</li>
          </ul>
        </div>

        {/* Col 4: Exclusive Promo */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-semibold">Winter Promo</h3>
          <div className="p-4 bg-white/[0.02] border border-[#c5a880]/30 rounded">
            <p className="text-xs text-frost/80">Use code <span className="text-[#c5a880] font-bold">NEXURA20</span> on WhatsApp checkout for a flat 20% discount.</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-frost/40 gap-4">
        <p>© 2026 NEXURA Garments Pakistan. All rights reserved.</p>
        <p className="text-[10px] tracking-wider uppercase text-[#c5a880]/60">Engineered For The Extreme Cold</p>
      </div>
    </footer>
  );
} 

