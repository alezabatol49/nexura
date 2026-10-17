import { useState } from "react";
import { Eye } from "lucide-react";
import { Product, formatPrice, buildWhatsAppOrderLink } from "../lib/types";
import { useCurrency } from "../lib/CurrencyContext";

type Props = {
  product: Product;
  onQuickView: (p: Product) => void;
};

export default function ProductCard({ product, onQuickView }: Props) {
  const { currency } = useCurrency();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  const waLink = buildWhatsAppOrderLink({ product, size, color, currency, method: "WhatsApp" });
  const codLink = buildWhatsAppOrderLink({ product, size, color, currency, method: "COD" });

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <div className="relative img-zoom bg-obsidian-50 aspect-[3/4] mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-obsidian/90 text-gold text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {product.badge}
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-4 right-4 bg-obsidian/90 text-frost/60 text-[9px] tracking-[0.25em] uppercase px-3 py-1.5">
            Sold Out
          </span>
        )}
        {/* Quick view */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-4 right-4 w-10 h-10 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center text-frost opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-frost hover:text-obsidian"
          aria-label="Quick view"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] tracking-[0.3em] uppercase text-slate-muted">
            {product.gender === "unisex" ? "Unisex" : product.gender === "men" ? "Mens" : "Womens"}
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gold font-medium">{formatPrice(product.price_pkr, currency)}</span>
            {product.compare_price_pkr != null && product.compare_price_pkr > product.price_pkr && (
              <span className="text-[9px] text-frost/30 line-through">{formatPrice(product.compare_price_pkr, currency)}</span>
            )}
          </span>
        </div>
        <h3 className="text-sm text-frost font-medium leading-snug">{product.name}</h3>

        {/* Size selector (compact) */}
        {product.sizes.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`text-[10px] tracking-wider px-2 py-1 border transition-colors ${
                  size === s
                    ? "border-frost text-obsidian bg-frost"
                    : "border-frost/20 text-frost/50 hover:border-frost/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Color selector */}
        {product.colors.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`text-[10px] tracking-wider px-2 py-0.5 transition-colors ${
                  color === c ? "text-gold" : "text-frost/40 hover:text-frost/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1">
            WhatsApp
          </a>
          <a href={codLink} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 !px-4 !py-3">
            COD
          </a>
        </div>
      </div>
    </div>
  );
}
