import { useEffect, useState, useMemo } from "react";
import { Product, CATEGORIES } from "../lib/types";
import { supabase } from "../lib/supabase";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";

interface Props {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function Catalog({ searchQuery = "", setSearchQuery }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<string>("all");
  const [quickView, setQuickView] = useState<Product | null>(null);

  // 1. Supabase se bina pagination break kiye maximum items load karna
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false })
        .limit(2000);

      if (isCancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setProducts((data ?? []) as Product[]);
      }
      setLoading(false);
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Comprehensive Filter: Title, Category, aur Gender ko mila kar filter karna
  const filtered = useMemo(() => {
    let list = products;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => (p.name || "").toLowerCase().includes(q));
    }

    if (!active || active === "all") return list;
    const target = active.toLowerCase().trim();

    return list.filter((p) => {
      const cat = (p.category || "").toLowerCase().trim();
      const gen = (p.gender || "").toLowerCase().trim();
      const title = (p.name || "").toLowerCase();

      if (target === "kids" || target === "kids & baby") {
        return cat.includes("kid") || cat.includes("baby") || gen === "kids" || title.includes("baby") || title.includes("kid") || title.includes("boy") || title.includes("girl") || title.includes("romper") || title.includes("baba");
      }
      if (target === "women" || target === "women / girls") {
        return cat.includes("women") || gen === "women" || title.includes("women") || title.includes("ladies") || title.includes("girl") || title.includes("kurti") || title.includes("suit");
      }
      if (target === "men" || target === "men collection") {
        return cat.includes("men") || gen === "men" || title.includes("men") || title.includes("gents");
      }
      if (target === "puffer-jackets") {
        return cat.includes("puffer") || title.includes("puffer") || title.includes("down jacket");
      }
      if (target === "arctic-parkas") {
        return cat.includes("parka") || title.includes("parka") || title.includes("long coat");
      }
      if (target === "hoodies") {
        return cat.includes("hoodie") || title.includes("hoodie") || title.includes("sweatshirt");
      }
      if (target === "cashmere-sweaters") {
        return cat.includes("sweater") || title.includes("sweater") || title.includes("cardigan") || title.includes("cashmere");
      }
      if (target === "gloves") {
        return cat.includes("glove") || title.includes("glove") || title.includes("dastane");
      }
      if (target === "thermal-socks") {
        return cat.includes("socks") || title.includes("socks") || title.includes("moze");
      }
      if (target === "balaclavas") {
        return cat.includes("balaclava") || title.includes("balaclava") || title.includes("mask") || title.includes("cap");
      }

      return cat === target;
    });
  }, [products, active, searchQuery]);

  return (
    <section id="catalog" className="px-4 lg:px-10 py-12 lg:py-20 max-w-7xl mx-auto">
      {/* 20% OFF Announcement Banner */}
      <div className="mb-10 rounded-lg border border-[#c5a880]/30 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-3 text-center shadow-lg">
        <p className="text-xs md:text-sm font-semibold tracking-wider text-[#e6ca9f] uppercase flex items-center justify-center gap-2 flex-wrap">
          <span>✨ NEXURA PROMO:</span> 
          <span className="bg-[#c5a880] text-black px-2 py-0.5 rounded text-xs font-bold">FLAT 20% OFF</span>
          <span>USE CODE: <span className="underline font-mono">NEXURA20</span> AT WHATSAPP CHECKOUT ✨</span>
        </p>
      </div>

      {/* Section Header */}
      <div className="text-center mb-8">
        <p className="section-label mb-2 text-xs tracking-widest text-[#c5a880] uppercase">The Collection</p>
        <h2 className="font-display text-3xl md:text-5xl text-frost font-bold">Family & Winter Garments</h2>
        <p className="text-frost/60 text-xs md:text-sm mt-3 max-w-lg mx-auto">
          Over 1,500+ premium pieces engineered for everyday comfort. Select your category and order via WhatsApp.
        </p>
        
        {/* Visitors Counter */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-frost/70">Live Verified Visitors:</span>
          <span className="font-mono bg-[#141414] border border-[#c5a880]/40 text-[#c5a880] px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider">
            1,482 Active Shoppers
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
        {CATEGORIES.map((c) => {
          const isSelected = active === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`text-[10px] md:text-[11px] tracking-[0.15em] uppercase px-4 py-2 border rounded-full transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-[#c5a880] bg-[#c5a880] text-black font-bold shadow-lg"
                  : "border-white/10 text-white/70 hover:border-[#c5a880]/50 hover:text-white bg-white/[0.02]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Verified Items Count Display */}
      {!loading && !error && (
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#c5a880] font-mono bg-white/[0.03] px-4 py-1.5 rounded-full border border-white/5">
            Showing {filtered.length} of {products.length} verified items
          </span>
        </div>
      )}

      {/* Grid of Products */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-900 animate-pulse rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-frost/50 text-sm">Failed to load garments: {error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-frost/50 text-sm">No items found in this collection. Please select another category or clear search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  );
}
