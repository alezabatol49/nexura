import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { Product, formatPrice, buildWhatsAppOrderLink } from "../lib/types";
import { useCurrency } from "../lib/CurrencyContext";

type Props = {
  product: Product;
  onClose: () => void;
};

export default function QuickView({ product, onClose }: Props) {
  const { currency } = useCurrency();
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  const waLink = buildWhatsAppOrderLink({ product, size, color, quantity: qty, currency, method: "WhatsApp" });
  const codLink = buildWhatsAppOrderLink({ product, size, color, quantity: qty, currency, method: "COD" });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl bg-obsidian-100 border border-frost/10 grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="relative aspect-[3/4] md:aspect-auto bg-obsidian-50">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-obsidian/90 text-gold text-[9px] tracking-[0.25em] uppercase px-3 py-1.5">
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-8 lg:p-10">
          <div className="flex items-start justify-between mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-muted">
              {product.gender === "unisex" ? "Unisex" : product.gender === "men" ? "Menswear" : "Womenswear"}
            </span>
            <button onClick={onClose} className="text-frost/60 hover:text-frost transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <h2 className="font-display text-2xl lg:text-3xl text-frost font-bold leading-tight mb-3">{product.name}</h2>
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-gold text-lg font-medium">{formatPrice(product.price_pkr, currency)}</p>
            {product.compare_price_pkr != null && product.compare_price_pkr > product.price_pkr && (
              <p className="text-sm text-frost/30 line-through">{formatPrice(product.compare_price_pkr, currency)}</p>
            )}
          </div>

          <p className="text-sm text-frost/60 leading-relaxed mb-8">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-frost/50 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`text-xs tracking-wider px-3 py-2 border transition-colors ${
                      size === s ? "border-frost bg-frost text-obsidian" : "border-frost/20 text-frost/60 hover:border-frost/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 1 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-frost/50 mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`text-xs tracking-wider px-3 py-2 border transition-colors ${
                      color === c ? "border-gold text-gold" : "border-frost/20 text-frost/60 hover:border-frost/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-frost/50 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 border border-frost/20 text-frost/70 hover:border-frost/50 transition-colors text-lg"
              >
                −
              </button>
              <span className="text-frost w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 border border-frost/20 text-frost/70 hover:border-frost/50 transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8">
            <Check size={14} className={product.in_stock ? "text-[#1f7a4d]" : "text-frost/30"} />
            <span className="text-[11px] tracking-wider text-frost/60">
              {product.in_stock ? "In stock — ready to ship" : "Currently sold out"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1">
              Order via WhatsApp
            </a>
            <a href={codLink} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1">
              Order COD
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
