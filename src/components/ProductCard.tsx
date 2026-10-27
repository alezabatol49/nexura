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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenGemini = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-nexura-ai", {
        detail: {
          productName: product.name,
          category: product.category || "Garments",
          price: formatPrice(priceNum)
        }
      })
    );
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#0c0c0c] border border-white/10 hover:border-[#c5a880]/60 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl"
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md text-[#c5a880] border border-[#c5a880]/30 text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1">
          {product.badge}
        </span>
      )}

      {/* Product Image with Smooth Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={imgError || !product.image_url ? fallbackImg : product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
        />

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleOpenGemini}
              className="bg-black/90 hover:bg-[#c5a880] text-[#c5a880] hover:text-black border border-[#c5a880]/40 p-2.5 rounded-full shadow-xl transition-all"
              title="Ask AI Stylist"
            >
              <span className="text-xs">✨</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 uppercase text-[10px] tracking-[0.25em] font-bold transition-all shadow-2xl ${
              added 
                ? "bg-emerald-600 text-white" 
                : "bg-[#c5a880] hover:bg-[#d6bc96] text-black"
            }`}
          >
            {added ? "Added To Bag" : "Quick Add +"}
          </button>
        </div>
      </div>

      {/* Typography & Pricing */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-[#0c0c0c]">
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#c5a880]/70 font-mono mb-1">
            {product.category || "Luxury Outerwear"}
          </p>
          <h3 className="text-xs font-light text-frost/90 line-clamp-1 group-hover:text-[#c5a880] transition-colors tracking-wide">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#c5a880] font-mono tracking-tight">
              {formatPrice(priceNum)}
            </span>
            {comparePrice && comparePrice > priceNum && (
              <span className="text-[10px] text-frost/40 line-through font-mono">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-widest text-frost/40 font-mono">
            COD Available
          </span>
        </div>
      </div>
    </div>
  );
}
