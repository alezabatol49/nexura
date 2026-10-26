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

  const priceNum = product.price_pkr ?? (product as any).price ?? 0;
  const fallbackImg = "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative flex flex-col bg-[#111] border border-white/5 rounded-sm overflow-hidden hover:border-[#c5a880]/40 transition-all duration-300">
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
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="bg-[#c5a880] text-black text-[10px] tracking-widest uppercase font-bold px-4 py-2 rounded-sm shadow-xl">
            Quick View
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880]/80 font-mono">
            {product.category || "Garments"}
          </span>
          <h3 
            onClick={() => onQuickView(product)}
            className="text-xs font-medium text-frost mt-1 line-clamp-2 leading-relaxed cursor-pointer hover:text-[#c5a880] transition-colors"
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] text-frost/40 uppercase">Price</p>
            <p className="text-sm font-bold text-[#c5a880]">
              {formatPrice(priceNum)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="text-[10px] uppercase tracking-wider bg-[#c5a880] text-black font-bold px-2.5 py-1.5 rounded hover:bg-[#d6bc96] transition-all cursor-pointer shadow"
            >
              + Cart
            </button>
            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(
                  `*Assalam-o-Alaikum NEXURA!*\nMain yeh product order karna chahta hoon:\n📦 *Item:* ${product.name}\n💰 *Price:* ${formatPrice(priceNum)}`
                );
                window.open(`https://wa.me/923219404812?text=${text}`, "_blank");
              }}
              className="text-[10px] uppercase bg-white/5 hover:bg-white/10 text-frost border border-white/10 px-2 py-1.5 rounded transition-all font-medium"
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
