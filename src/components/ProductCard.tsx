import React, { useState } from "react";
import { Product } from "../lib/types";
import { useCurrency } from "../lib/CurrencyContext";
import { useCart } from "../lib/CartContext";

interface Props {
  product: Product;
  onQuickView: (p: Product) => void;
}

export default function ProductCard({ product, onQuickView }: Props) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const priceNum = product.price_pkr ?? (product as any).price ?? 0;
  const comparePrice = product.compare_price_pkr ?? (product as any).compare_price ?? null;
  const fallbackImg = "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80";

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `*Assalam-o-Alaikum NEXURA!*\n\nMain yeh garment order karna chahta hoon:\n\n` +
      `📦 *Item:* ${product.name}\n` +
      `💰 *Price:* ${formatPrice(priceNum)}\n` +
      `🏷️ *Category:* ${product.category || "Winter Collection"}\n\n` +
      `Kindly confirm availability aur COD dispatch details batayein.`
    );
    window.open(`https://wa.me/923219404812?text=${msg}`, "_blank");
  };

  const handleAIStylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `*Assalam-o-Alaikum NEXURA AI Salesman / Stylist!*\n\n` +
      `Mujhe is product ke size aur styling ke bare mein guide karein:\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* ${formatPrice(priceNum)}\n\n` +
      `Meri height aur weight ke mutabiq best fit size kya hoga?`
    );
    window.open(`https://wa.me/923219404812?text=${msg}`, "_blank");
  };

  return (
    <div className="group relative flex flex-col bg-[#111111] border border-white/5 rounded-sm overflow-hidden hover:border-[#c5a880]/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#c5a880]/5">
      
      {/* Top Badge */}
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-[#c5a880] text-black text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow">
          {product.badge}
        </span>
      )}

      {/* Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 cursor-pointer"
      >
        <img
          src={imgError || !product.image_url ? fallbackImg : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Quick View Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="bg-black/90 text-[#c5a880] border border-[#c5a880]/40 text-[10px] tracking-widest uppercase font-bold px-4 py-2 rounded shadow-2xl backdrop-blur-sm">
            Quick View
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#111] to-[#0c0c0c]">
        <div>
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-mono mb-1">
            <span className="text-[#c5a880]/80">{product.category || "Garments"}</span>
            <span className="text-emerald-400 font-semibold">In Stock</span>
          </div>
          <h3 
            onClick={() => onQuickView(product)}
            className="text-xs font-medium text-frost line-clamp-2 leading-relaxed cursor-pointer hover:text-[#c5a880] transition-colors"
          >
            {product.name}
          </h3>
        </div>

        {/* Price and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#c5a880] font-mono">
              {formatPrice(priceNum)}
            </span>
            {comparePrice && comparePrice > priceNum && (
              <span className="text-[10px] text-frost/40 line-through font-mono">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>

          {/* Action Row 1: Add to Cart & WhatsApp Order */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`text-[10px] uppercase tracking-wider py-2 rounded font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                added 
                  ? "bg-emerald-600 text-white" 
                  : "bg-[#c5a880] hover:bg-[#d6bc96] text-black active:scale-95"
              }`}
            >
              <span>🛍️</span>
              <span>{added ? "Added!" : "+ Add to Bag"}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="text-[10px] uppercase tracking-wider py-2 px-2 rounded font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {/* Modern Official WhatsApp SVG Icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 2c-5.508 0-9.984 4.477-9.984 9.984 0 1.761.458 3.479 1.328 4.996l-1.41 5.156 5.285-1.387c1.465.799 3.117 1.22 4.781 1.22 5.508 0 9.984-4.477 9.984-9.984 0-5.508-4.476-9.985-9.984-9.985zm5.836 14.153c-.244.685-1.42 1.309-1.961 1.353-.518.043-1.189.062-3.411-.859-2.842-1.178-4.668-4.072-4.81-4.26-.142-.188-1.144-1.523-1.144-2.906 0-1.383.725-2.062.981-2.344.256-.282.56-.352.748-.352.188 0 .376.002.539.01.173.008.406-.066.635.484.236.567.807 1.97.877 2.113.07.143.117.311.023.499-.094.188-.141.305-.281.472-.14.167-.295.372-.422.5-.141.142-.288.297-.124.579.164.282.729 1.205 1.564 1.949 1.074.957 1.979 1.254 2.261 1.395.282.141.447.117.611-.071.164-.188.705-.823.893-1.105.188-.282.376-.235.634-.141.258.094 1.637.772 1.919.913.282.141.47.212.54.329.071.118.071.683-.173 1.368z"/>
              </svg>
              <span>Order</span>
            </button>
          </div>

          {/* Action Row 2: AI Stylist / Salesman Guide */}
          <button
            type="button"
            onClick={handleAIStylist}
            className="w-full text-[9px] uppercase tracking-widest py-1.5 rounded font-mono bg-white/[0.03] hover:bg-[#c5a880]/10 text-frost/70 hover:text-[#c5a880] border border-white/5 hover:border-[#c5a880]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>✨</span>
            <span>Ask AI Salesman For Sizing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
