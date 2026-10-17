import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "../lib/types";

export default function Footer() {
  return (
    <footer className="bg-obsidian-50 border-t border-frost/10 px-5 lg:px-10 pt-20 pb-10">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="font-display text-2xl tracking-[0.3em] text-frost font-bold pl-[0.3em] mb-5">NEXURA</h3>
          <p className="text-sm text-frost/50 leading-relaxed">
            Ultra-luxury winter outerwear and garments. Engineered for the extreme cold, crafted for those who demand more.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-frost/40 mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {["Puffer Jackets", "Arctic Parkas", "Heavyweight Hoodies", "Cashmere Sweaters", "Accessories"].map((l) => (
              <li key={l}>
                <a href="#catalog" className="text-sm text-frost/60 hover:text-gold transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-frost/40 mb-5">Help</h4>
          <ul className="flex flex-col gap-3">
            <li><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-frost/60 hover:text-gold transition-colors">WhatsApp Orders</a></li>
            <li><span className="text-sm text-frost/60">Cash on Delivery</span></li>
            <li><span className="text-sm text-frost/60">Shipping & Returns</span></li>
            <li><span className="text-sm text-frost/60">Size Guide</span></li>
            <li><span className="text-sm text-frost/60">Contact: 0321-9404812</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-frost/40 mb-5">Stay Updated</h4>
          <p className="text-sm text-frost/50 mb-4">Get early access to new drops and private offers.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-obsidian border border-frost/15 px-4 py-3 text-xs text-frost placeholder:text-frost/30 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button className="bg-frost text-obsidian px-4 text-xs tracking-widest uppercase hover:bg-gold transition-colors">
              Join
            </button>
          </form>
          <div className="flex items-center gap-4 mt-6">
            {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-frost/40 hover:text-gold transition-colors"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-frost/10">
        <p className="text-[11px] text-frost/40 tracking-wider">
          © {new Date().getFullYear()} NEXURA. All rights reserved.
        </p>
        <p className="text-[11px] text-frost/40 tracking-wider">
          WhatsApp: 0321-9404812 · COD Across Pakistan
        </p>
      </div>
    </footer>
  );
}
