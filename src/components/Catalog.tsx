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

  // 1. Fetch products from Supabase
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

  // 2. Filter listener
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

  // 3. 100% Strict Category Logic (Zero Mixing)
  const filtered = useMemo(() => {
    if (!active || active === "all") return products;

    const target = active.toLowerCase().trim();

    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase().trim();
      const gen = (p.gender || "").toLowerCase().trim();
      const title = (p.name || (p as any).title || "").toLowerCase();

      // A. Specific Winter Items (First priority exact match)
      if (target === "balaclavas") {
        return cat === "balaclavas" || title.includes("balaclava") || title.includes("goggle mask") || (title.includes("mask") && !title.includes("frock"));
      }
      if (target === "puffer-jackets" || target === "puffer jackets") {
        return (cat === "puffer-jackets" || title.includes("puffer")) && !title.includes("baby") && !title.includes("kid");
      }
      if (target === "arctic-parkas" || target === "arctic parkas") {
        return cat === "arctic-parkas" || title.includes("parka");
      }
      if (target === "heavyweight-hoodies" || target === "heavyweight hoodies") {
        return (cat === "heavyweight-hoodies" || title.includes("hoodie")) && !title.includes("baby") && !title.includes("kid");
      }
      if (target === "cashmere-sweaters" || target === "cashmere sweaters") {
        return (cat === "cashmere-sweaters" || title.includes("sweater") || title.includes("cardigan")) && !title.includes("baby") && !title.includes("kid");
      }
      if (target === "leather-gloves" || target === "leather gloves") {
        return cat === "leather-gloves" || title.includes("glove");
      }
      if (target === "thermal-socks" || target === "thermal socks") {
        return cat === "thermal-socks" || title.includes("socks");
      }

      // B. Kids & Baby (Strictly children items, block adult winter gear)
      if (target === "kids" || target === "kids & baby") {
        const isAdultGear = ["balaclavas", "leather-gloves", "arctic-parkas", "cashmere-sweaters"].includes(cat);
        if (isAdultGear) return false;

        return (
          cat === "kids" ||
          gen === "kids" ||
          title.includes("baby") ||
          title.includes("baba") ||
          title.includes("kid") ||
          title.includes("romper")
        );
      }

      // C. Women / Girls (Block all gents, caps, and balaclavas)
      if (target === "women" || target === "women / girls") {
        if (cat === "balaclavas" || cat === "leather-gloves" || title.includes("balaclava") || title.includes("beanie")) return false;
        if (title.includes("men ") || title.includes("gents") || gen === "men") return false;

        return (
          cat === "women" ||
          gen === "women" ||
          title.includes("women") ||
          title.includes("ladies") ||
          title.includes("girl") ||
          title.includes("kurti") ||
          title.includes("shawl")
        );
      }

      // D. Men Main Collection (Exclude other winter tabs)
      if (target === "men" || target === "men collection") {
        const isOtherSubcat = [
          "puffer-jackets", "arctic-parkas", "heavyweight-hoodies",
          "cashmere-sweaters", "leather-gloves", "thermal-socks", "balaclavas"
        ].includes(cat);
        if (isOtherSubcat) return false;

        const isFemale = cat === "women" || gen === "women" || title.includes("women") || title.includes("girl") || title.includes("ladies");
        const isChild = cat === "kids" || gen === "kids" || title.includes("baby") || title.includes("kid");

        return (cat === "men" || gen === "men") && !isFemale && !isChild;
      }

      return cat === target;
    });
  }, [products, active]);

  return (
    <section id="catalog" className="px-5 lg:px-10 py-12 lg:py-20">
      {/* 20% OFF Announcement Banner */}
      <div className="mb-10 max-w-4xl mx-auto rounded-lg overflow-hidden border border-[#c5a880]/30 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-3 text-center shadow-lg">
        <p className="text-xs md:text-sm font-semibold tracking-wider text-[#e6ca9f] uppercase flex items-center justify-center gap-2">
          <span>✨ NEXURA PROMO:</span> 
          <span className="bg-[#c5a880] text-black px-2 py-0.5 rounded text-xs font-bold">FLAT 20% OFF</span>
          <span>CODE: <span className="underline">NEXURA20</span> AT WHATSAPP CHECKOUT ✨</span>
        </p>
      </div>

      {/* Section header */}
      <div className="text-center mb-10">
        <p className="section-label mb-3 text-xs tracking-widest text-[#c5a880] uppercase">The Collection</p>
        <h2 className="font-display text-3xl md:text-5xl text-frost font-bold">Family & Winter Garments</h2>
        <p className="mt-3 text-sm text-frost/50 max-w-md mx-auto">
          Over 1,500+ premium pieces engineered for everyday comfort. Select your category and order via WhatsApp.
        </p>

        {/* Live Visitor Counter */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Verified Visitors:</span>
          <img 
            src="https://api.visitorbadge.io/api/visitors?pageId=nexura-pk.netlify.app&label=&countColor=%23c5a880&style=flat" 
            alt="Visitor Counter" 
            className="inline-block h-4" 
          />
        </div>
      </div>

      {/* Filter Tabs */}
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
                  ? "border-[#c5a880] bg-[#c5a880] text-black font-bold shadow-lg"
                  : "border-white/10 text-white/70 hover:border-[#c5a880]/50 hover:text-white bg-white/[0.02]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Counter */}
      {!loading && !error && (
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-frost/40">
            Showing {filtered.length} verified items
          </span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] bg-neutral-900 animate-pulse mb-4 rounded" />
              <div className="h-3 w-20 bg-neutral-900 animate-pulse mb-2 rounded" />
              <div className="h-4 w-40 bg-neutral-900 animate-pulse rounded" />
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
          {filtered.map((p) => {
            // Type-safe price access (ایرر کو جڑ سے ختم کر دیا)
            const displayPrice = p.price_pkr ?? (p as any).price ?? 0;
            return (
              <div key={p.id} className="flex flex-col">
                <ProductCard product={p} onQuickView={setQuickView} />
                
                {/* Gemini AI Stylist Button */}
                <button
                  type="button"
                  onClick={() => {
                    const prompt = encodeURIComponent(
                      `Assalam-o-Alaikum! Main NEXURA Store par yeh product dekh raha hoon:\n\n*Item:* ${p.name}\n*Price:* Rs. ${displayPrice}\n\nIs item ka fabric kaisa hai aur size select karne mein meri madad karein.`
                    );
                    window.open(`https://wa.me/923219404812?text=${prompt}`, "_blank");
                  }}
                  className="mt-2 w-full py-1.5 px-2 bg-neutral-900 border border-[#c5a880]/40 text-[#c5a880] text-[10px] tracking-wider uppercase hover:bg-[#c5a880] hover:text-black transition-all flex items-center justify-center gap-1.5 rounded cursor-pointer"
                >
                  <span>🤖</span> Ask Gemini Stylist
                </button>
              </div>
            );
          })}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  );
}
