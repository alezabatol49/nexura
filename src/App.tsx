import { useState } from "react";
import { CurrencyProvider } from "./lib/CurrencyContext";
import { useRoute } from "./lib/useRoute";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureBar from "./components/FeatureBar";
import Catalog from "./components/Catalog";
import Editorial from "./components/Editorial";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Admin from "./components/Admin";

export default function App() {
  const route = useRoute();
  const [showTerms, setShowTerms] = useState(false);

  if (route === "/admin") {
    return <Admin />;
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-obsidian text-frost relative selection:bg-[#c5a880] selection:text-black">
        {/* Top 20% OFF Announcement Bar */}
        <TopBar />

        {/* Navigation Header */}
        <Header />

        <main>
          <Hero />
          <FeatureBar />
          <Catalog />
          <Editorial />
        </main>

        {/* Footer بغیر کسی غیر ضروری prop کے */}
        <Footer />

        {/* WhatsApp Floating Action */}
        <FloatingWhatsApp />

        {/* Floating Terms Button */}
        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="fixed bottom-4 left-4 z-40 bg-neutral-900/90 border border-[#c5a880]/40 text-[#c5a880] text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg hover:bg-[#c5a880] hover:text-black transition-all cursor-pointer"
        >
          📜 Terms & Policy
        </button>

        {/* Terms & Conditions / Store Policy Modal */}
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#121212] border border-[#c5a880]/30 rounded-xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative text-frost max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 text-frost/60 hover:text-[#c5a880] text-xl font-bold p-1 cursor-pointer transition-colors"
                aria-label="Close Terms"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">Official Policy</span>
                <h3 className="font-display text-2xl md:text-3xl text-frost font-bold mt-1">Terms & Conditions</h3>
                <div className="h-0.5 w-12 bg-[#c5a880] mx-auto mt-3"></div>
              </div>

              <div className="space-y-5 text-xs md:text-sm text-frost/80 leading-relaxed font-light">
                <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                  <h4 className="font-semibold text-[#c5a880] text-sm mb-1">1. Cash on Delivery (COD)</h4>
                  <p>
                    پورے پاکستان میں کیش آن ڈلیوری کی سہولت موجود ہے۔ پارسل وصول کرتے وقت کوریئر رائیڈر کو نقد ادائیگی کریں۔
                  </p>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                  <h4 className="font-semibold text-[#c5a880] text-sm mb-1">2. Shipping & Delivery Time</h4>
                  <p>
                    آرڈر کی تصدیق کے بعد 3 سے 5 کام کے دنوں (Working Days) کے اندر پارسل آپ کی دہلیز تک پہنچا دیا جاتا ہے۔
                  </p>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                  <h4 className="font-semibold text-[#c5a880] text-sm mb-1">3. 7-Day Replacement Guarantee</h4>
                  <p>
                    اگر پروڈکٹ میں کوئی سائز کا مسئلہ ہو یا سامان خراب نکلے، تو ڈیلیوری کے 7 دن کے اندر واٹس ایپ سپورٹ پر رابطہ کر کے باآسانی ریپلیسمنٹ حاصل کی جا سکتی ہے۔
                  </p>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/5">
                  <h4 className="font-semibold text-[#c5a880] text-sm mb-1">4. 20% Launch Promo Discount</h4>
                  <p>
                    پروموشنل کوڈ <strong className="text-frost font-semibold">NEXURA20</strong> واٹس ایپ پر آرڈر دیتے وقت لاگو ہوتا ہے اور یہ ہر آئٹم پر فلیٹ 20 فیصد رعایت فراہم کرتا ہے۔
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2.5 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-bold rounded hover:bg-[#d6bc96] transition-all cursor-pointer"
                >
                  I Understand & Agree
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CurrencyProvider>
  );
}
