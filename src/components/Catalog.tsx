import { useEffect, useState, useMemo } from "react";
import { Product, CATEGORIES } from "../lib/types";
import { supabase } from "../lib/supabase";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string>("all");
  const [quickView, setQuickView] = useState<Product | null>(null);

  // 1. Fetch all products (up to 2500)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2500);

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setProducts((data ?? []) as Product[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Listen for filter events dispatched by Header
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail as string;
      if (slug) {
        setActive(slug.toLowerCase().trim());
      }
    };
    window.addEventListener("nexura:filter", handler);
    return () => window.removeEventListener("nexura:filter", handler);
  }, []);

  // 3. Bulletproof Filter Logic (Category + Gender + Title fallback)
  const filtered = useMemo(() => {
    if (!active || active === "all") return products;

    const target = active.toLowerCase().trim();

    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const gen = (p.gender || "").toLowerCase();
      const title = (p.name || (p as any).title || "").toLowerCase();

      // Kids & Baby Match
      if (target === "kids" || target.includes("kid") || target.includes("baby")) {
        return (
          cat === "kids" ||
          gen === "kids" ||
          cat.includes("kid") ||
          cat.includes("baby") ||
          title.includes("baby") ||
          title.includes("kid") ||
          title.includes("romper") ||
          title.includes("nest")
        );
      }

      // Women / Girls Match
      if (target === "women" || target.includes("women") || target.includes("girl")) {
        return (
          cat === "women" ||
          gen === "women" ||
          cat.includes("women") ||
          cat.includes("girl") ||
          title.includes("women") ||
          title.includes("girl") ||
          title.includes("kurti") ||
          title.includes("shawl") ||
          title.includes("khaddar")
        );
      }

      // Men Collection Match
      if (target === "men" || target.includes("men")) {
        // Women اور Kids کو خارج کریں تاکہ صرف خالص Men نظر آئے
        const isNotFemale = !cat.includes("women") && !gen.includes("women") && !title.includes("women") && !title.includes("girl");
        const isNotBaby = !cat.includes("kid") && !gen.includes("kid") && !title.includes("baby");

        return (
          (cat === "men" || gen === "men" || title.includes("men ") || title.startsWith("men")) &&
          isNotFemale &&
          isNotBaby
        );
      }

      // Other specific categories (Puffer Jackets, Hoodies, etc.)
      return cat.includes(target) || title.includes(target);
    });
  }, [products, active]);

  return (
    <section id="catalog" className="px-5 lg:px-10 py-20 lg:py-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <p className="section-label mb-4">The Collection</p>
        <h2 className="font-display text-3xl md:text-5xl text-frost font-bold">Family & Winter Garments</h2>
        <p className="mt-4 text-sm text-frost/50 max-w-md mx-auto">
          Over 1,500+ premium pieces engineered for everyday comfort. Select your category and order via WhatsApp.
        </p>
      </div>

      {/* Category Pills / Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        {CATEGORIES.map((c) => {
          const isSelected = active === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-frost bg-frost text-obsidian font-bold shadow-lg"
                  : "border-frost/15 text-frost/70 hover:border-frost/40 hover:text-frost bg-white/[0.02]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Products Count Indicator */}
      {!loading && !error && (
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-frost/40">
            Showing {filtered.length} items
          </span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] bg-obsidian-50 animate-pulse mb-4" />
              <div className="h-3 w-20 bg-obsidian-50 animate-pulse mb-2" />
              <div className="h-4 w-40 bg-obsidian-50 animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-frost/50 text-sm">Couldn't load products. Please refresh.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-frost/50 text-sm">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  );
}
