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
  const [size, setSize] = useState(product.sizes?.[0] ?? "M");
  const [color, setColor] = useState(product.colors?.[0] ?? "Standard");

  const waLink = buildWhatsAppOrderLink({ product, size, color, currency, method: "WhatsApp" });
  const codLink = buildWhatsAppOrderLink({ product, size, color, currency, method: "COD" });

  const getGenderLabel = () => {
    const c = (product.category || "").toLowerCase();
    if (c === "kids") return "Kids & Baby";
    if (c === "women") return "Womens";
    if (c === "men") return "Mens";
    return "Collection";
  };

  return (
    <div className="group flex flex-col h-full justify-between bg-white/[0.01] p-2.5 rounded border border-frost/5 hover:border-frost/20 transition-all duration-300">
      <div>
        {/* Product Image Frame */}
        <div className="relative img-zoom bg-[#14161d] aspect-[3/4] mb-3 overflow-hidden rounded flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {product.badge && (
            <span className="absolute top-3 left-3 bg-obsidian/90 text-gold text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-sm border border-gold/20">
              {product.badge}
            </span>
          )}

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 right-3 w-9 h-9 bg-obsidian/90 backdrop-blur-sm flex items-center justify-center text-frost opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-frost hover:text-obsidian cursor-pointer rounded-full"
            aria-label="Quick view"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] tracking-[0.25em] uppercase text-frost/50 font-medium">
              {getGenderLabel()}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-[12px] text-gold font-semibold">
                {formatPrice(product.price_pkr, currency)}
              </span>
              {product.compare_price_pkr != null && product.compare_price_pkr > product.price_pkr && (
                <span className="text-[9px] text-frost/30 line-through">
                  {formatPrice(product.compare_price_pkr, currency)}
                </span>
              )}
            </span>
          </div>

          <h3
            className="text-xs md:text-sm text-frost/90 font-normal leading-snug line-clamp-2 min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.sizes && product.sizes.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.sizes.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`text-[9px] tracking-wider px-2 py-0.5 border transition-colors cursor-pointer ${
                    size === s
                      ? "border-frost text-obsidian bg-frost font-bold"
                      : "border-frost/15 text-frost/50 hover:border-frost/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-2 border-t border-frost/5">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1 text-center py-2 text-[10px] tracking-wider"
        >
          WhatsApp
        </a>
        <a
          href={codLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost flex-1 text-center py-2 text-[10px] tracking-wider !px-2"
        >
          COD
        </a>
      </div>
    </div>
  );
}
