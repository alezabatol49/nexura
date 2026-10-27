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
      className="fixed bottom-24 right-4 z-40 bg-[#c5a880] text-black font-bold p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
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
  const [showTerms, setShowTerms] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  // ایڈمن پن کوڈ
  const [adminPin, setAdminPin] = useState("");
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  // پراڈکٹس لوڈ کر کے جیمنی بوٹ کو دینا تاکہ وہ گاہک کو صحیح چیزیں دکھائے
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").limit(50);
      if (data) setProducts(data as Product[]);
    })();
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
                  else alert("غلط پن کوڈ!");
                }
              }}
              className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-frost text-sm text-center tracking-widest outline-none focus:border-[#c5a880] transition-colors mb-4"
            />
            <button
              type="button"
              onClick={() => {
                if (adminPin === "7860") setIsAdminAuthed(true);
                else alert("غلط پن کوڈ!");
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
        <div className="min-h-screen bg-obsidian text-frost relative selection:bg-[#c5a880] selection:text-black">
          {/* Top Bar */}
          <TopBar />

          {/* Header */}
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <main>
            <Hero />
            <FeatureBar />
            <Catalog searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Editorial />
          </main>

          {/* Footer */}
          <Footer />

          {/* دائیں طرف واٹس ایپ بٹن */}
          <FloatingWhatsApp />

          {/* تیرتا ہوا شاپنگ بیگ */}
          <CartFloatingTrigger />

          {/* شاپنگ بیگ دراز */}
          <CartDrawer />

          {/* بائیں طرف NEXURA AI Stylist / Salesman */}
          <GeminiChatbot products={products} />

          {/* Terms Button */}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="fixed bottom-4 left-36 z-40 bg-neutral-900/90 border border-[#c5a880]/40 text-[#c5a880] text-[9px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg hover:bg-[#c5a880] hover:text-black transition-all cursor-pointer backdrop-blur"
          >
            📜 Policy
          </button>

          {/* Terms Modal */}
          {showTerms && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#121212] border border-[#c5a880]/30 rounded-xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative text-frost max-h-[85vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setShowTerms(false)}
                  className="absolute top-4 right-4 text-frost/60 hover:text-[#c5a880] text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
                <div className="text-center mb-6">
                  <span className="text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">Official Policy</span>
                  <h3 className="font-display text-2xl md:text-3xl text-frost font-bold mt-1">Terms & Conditions</h3>
                  <div className="h-0.5 w-12 bg-[#c5a880] mx-auto mt-3"></div>
                </div>
                <div className="space-y-4 text-xs md:text-sm text-frost/80 leading-relaxed font-light">
                  <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                    <h4 className="font-semibold text-[#c5a880] text-sm mb-1">1. Cash on Delivery (COD)</h4>
                    <p>پورے پاکستان میں کیش آن ڈلیوری کی سہولت موجود ہے۔ پارسل وصول کرتے وقت کوریئر رائیڈر کو نقد ادائیگی کریں۔</p>
                  </div>
                  <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                    <h4 className="font-semibold text-[#c5a880] text-sm mb-1">2. Shipping & Delivery Time</h4>
                    <p>آرڈر کی تصدیق کے بعد 3 سے 5 کام کے دنوں کے اندر پارسل آپ کی دہلیز تک پہنچا دیا جاتا ہے۔</p>
                  </div>
                  <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                    <h4 className="font-semibold text-[#c5a880] text-sm mb-1">3. 7-Day Replacement Guarantee</h4>
                    <p>اگر پروڈکٹ میں سائز کا مسئلہ ہو یا سامان خراب نکلے، تو 7 دن کے اندر واٹس ایپ پر باآسانی ریپلیسمنٹ حاصل کریں۔</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CartProvider>
    </CurrencyProvider>
  );
}
