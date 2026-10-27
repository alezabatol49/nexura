import { useState, useEffect } from "react";
import { CurrencyProvider } from "./lib/CurrencyContext";
import { CartProvider, useCart } from "./lib/CartContext";
import { useRoute } from "./lib/useRoute";
import { supabase } from "./lib/supabase";
import { Product } from "./lib/types";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureBar from "./components/FeatureBar";
import Catalog from "./components/Catalog";
import Editorial from "./components/Editorial";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import CartDrawer from "./components/CartDrawer";
import GeminiChatbot from "./components/GeminiChatbot";
import Admin from "./components/Admin";

function CartFloatingTrigger() {
  const { totalCount, setIsCartOpen } = useCart();
  if (totalCount === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-24 right-6 z-40 bg-[#c5a880] text-black font-bold p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-black/20"
      title="View Shopping Bag"
      aria-label="View Shopping Bag"
    >
      <span className="text-lg">🛍️</span>
      <span className="absolute -top-1 -right-1 bg-black text-[#c5a880] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#c5a880] font-mono shadow">
        {totalCount}
      </span>
    </button>
  );
}

export default function App() {
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.from("products").select("*").limit(200);
      if (isMounted && data) {
        setProducts(data as Product[]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (route === "/admin") {
    if (!isAdminAuthed) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#c5a880]/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <span className="text-3xl mb-2 inline-block">🔐</span>
            <h2 className="text-[#c5a880] text-lg font-bold mb-1 uppercase tracking-widest">NEXURA Admin</h2>
            <p className="text-frost/50 text-xs mb-6">Enter secure PIN to access management</p>
            <input
              type="password"
              placeholder="Enter PIN (Default: 7860)"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (adminPin === "7860") setIsAdminAuthed(true);
                  else alert("Ghalat PIN code!");
                }
              }}
              className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-frost text-sm text-center tracking-widest outline-none focus:border-[#c5a880] transition-colors mb-4"
            />
            <button
              type="button"
              onClick={() => {
                if (adminPin === "7860") setIsAdminAuthed(true);
                else alert("Ghalat PIN code!");
              }}
              className="w-full bg-[#c5a880] text-black font-bold py-2.5 rounded text-xs uppercase tracking-widest hover:bg-[#d6bc96] transition-all cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </div>
        </div>
      );
    }
    return <Admin />;
  }

  return (
    <CurrencyProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#070707] text-frost relative selection:bg-[#c5a880] selection:text-black">
          <TopBar />
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <main>
            <Hero />
            <FeatureBar />
            <Catalog searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Editorial />
          </main>

          <Footer />

          {/* Clean Floating Controls */}
          <FloatingWhatsApp />
          <CartFloatingTrigger />
          <CartDrawer />
          <GeminiChatbot products={products} />
        </div>
      </CartProvider>
    </CurrencyProvider>
  );
}
