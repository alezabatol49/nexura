import React, { useState } from "react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#c5a880]/20 text-frost/70 pt-16 pb-12 px-6 lg:px-16 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.25em] text-[#c5a880] font-bold">NEXURA</h2>
          <p className="text-frost/60 leading-relaxed font-light">
            Pakistan's premier luxury outerwear and winter fashion atelier. Crafted for enduring warmth, timeless silhouettes, and effortless elegance.
          </p>
          <div className="text-[11px] font-mono text-[#c5a880]">
            Helpline / WhatsApp: +92 300 1700927
          </div>
        </div>

        {/* Col 2: Customer Care */}
        <div className="space-y-3">
          <h3 className="font-bold text-frost uppercase tracking-widest text-xs border-b border-white/5 pb-2 text-[#c5a880]">
            Customer Support
          </h3>
          <ul className="space-y-2 text-frost/70">
            <li>Cash on Delivery (COD) Nationwide</li>
            <li>3-5 Business Days Delivery</li>
            <li>7-Day Replacement Guarantee</li>
            <li>Live Fashion Stylist AI Assistance</li>
          </ul>
        </div>

        {/* Col 3: AdSense & Legal Policies */}
        <div className="space-y-3">
          <h3 className="font-bold text-frost uppercase tracking-widest text-xs border-b border-white/5 pb-2 text-[#c5a880]">
            Legal & Compliance
          </h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveModal("privacy")} 
                className="hover:text-[#c5a880] transition-colors cursor-pointer text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal("terms")} 
                className="hover:text-[#c5a880] transition-colors cursor-pointer text-left"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal("returns")} 
                className="hover:text-[#c5a880] transition-colors cursor-pointer text-left"
              >
                Refund & Return Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal("shipping")} 
                className="hover:text-[#c5a880] transition-colors cursor-pointer text-left"
              >
                Shipping Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Corporate & Real Estate Disclaimer */}
        <div className="space-y-3">
          <h3 className="font-bold text-frost uppercase tracking-widest text-xs border-b border-white/5 pb-2 text-[#c5a880]">
            Corporate Disclosure
          </h3>
          <p className="text-[11px] leading-relaxed text-frost/50">
            NEXURA.PK operates independently as a registered luxury garments & apparel storefront. Property consultations and land assets are managed separately under Bin Taha Associates.
          </p>
          <div className="pt-2 text-[10px] font-mono text-emerald-400">
            SSL 256-Bit Encrypted & Verified
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-frost/40">
        <p>© {new Date().getFullYear()} NEXURA.PK. All Rights Reserved. Google AdSense & Merchant Compliant.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[10px]">Lahore, Pakistan</p>
      </div>

      {/* Modal for AdSense Compliance Pages */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#c5a880]/30 rounded-xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative text-frost max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-frost/60 hover:text-[#c5a880] text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-lg font-bold text-[#c5a880] mb-3">Privacy Policy (AdSense Compliant)</h3>
                <p className="text-xs leading-relaxed text-frost/80 mb-3">
                  At NEXURA.PK, accessible from nexura-phi.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by NEXURA.PK and how we use it.
                </p>
                <p className="text-xs leading-relaxed text-frost/80 mb-2">
                  <strong>Cookies and Web Beacons:</strong> NEXURA uses standard cookies to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.
                </p>
                <p className="text-xs leading-relaxed text-frost/80">
                  <strong>Google AdSense:</strong> Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-lg font-bold text-[#c5a880] mb-3">Terms and Conditions</h3>
                <p className="text-xs leading-relaxed text-frost/80 mb-3">
                  By accessing this website, you agree to comply with our terms of service, all applicable laws and regulations of Pakistan, and agree that you are responsible for compliance with any applicable local laws.
                </p>
                <p className="text-xs leading-relaxed text-frost/80">
                  All products, including winter jackets, unstitched suits, and luxury apparel, are subject to availability and delivered via reputable courier partners on Cash on Delivery (COD).
                </p>
              </div>
            )}

            {activeModal === "returns" && (
              <div>
                <h3 className="text-lg font-bold text-[#c5a880] mb-3">Refund & 7-Day Replacement Policy</h3>
                <p className="text-xs leading-relaxed text-frost/80 mb-2">
                  Customer satisfaction is our highest priority. We offer a 7-day hassle-free replacement warranty for size mismatches or manufacturing defects.
                </p>
                <p className="text-xs leading-relaxed text-frost/80">
                  To initiate an exchange, please reach out directly to our official WhatsApp support at 03219404812 with your order confirmation.
                </p>
              </div>
            )}

            {activeModal === "shipping" && (
              <div>
                <h3 className="text-lg font-bold text-[#c5a880] mb-3">Shipping & Cash On Delivery</h3>
                <p className="text-xs leading-relaxed text-frost/80 mb-2">
                  We ship across all cities in Pakistan. Orders are typically processed within 24 hours and delivered within 3-5 business days.
                </p>
                <p className="text-xs leading-relaxed text-frost/80">
                  Payment is made directly in cash to the delivery rider upon inspecting the parcel seal.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
