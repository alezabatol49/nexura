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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

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

  // Listen for filter events from header
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail as string;
      if (slug) setActive(slug);
    };
    window.addEventListener("nexura:filter", handler);
    return () => window.removeEventListener("nexura:filter", handler);
  }, []);

  const filtered = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter(
            (p) =>
              p.category === active ||
              p.gender === active ||
              (active === "kids" && (p.category === "kids" || p.gender === "kids")) ||
              (active === "women" && (p.category === "women" || p.gender === "women")) ||
              (active === "men" && (p.category === "men" || p.gender === "men"))
          ),
    [products, active]
  );

  return (
    <section id="catalog" className="px-5 lg:px-10 py-20 lg:py-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <p className="section-label mb-4">The Collection</p>
        <h2 className="font-display text-3xl md:text-5xl text-frost font-bold">Family & Winter Garments</h2>
        <p className="mt-4 text-sm text-frost/50 max-w-md mx-auto">
          Premium collection engineered for everyday comfort and warmth. Select your fit and order via WhatsApp.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`text-[10px] md:text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 border transition-all duration-300 ${
              active === c.slug
                ? "border-frost bg-frost text-obsidian font-semibold"
                : "border-frost/15 text-frost/60 hover:border-frost/40 hover:text-frost"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

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
          <p className="text-frost/50 text-sm">No items in this category yet.</p>
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
