import React from "react";
import { useCart } from "../lib/CartContext";
import { useCurrency } from "../lib/CurrencyContext";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let orderList = "";
    items.forEach((item, index) => {
      const price = item.product.price_pkr ?? (item.product as any).price ?? 0;
      orderList += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) - Rs. ${(price * item.quantity).toLocaleString("en-PK")}\n`;
    });

    const msg = encodeURIComponent(
      `*Assalam-o-Alaikum NEXURA!*\n\nMain neeche diye gaye items ka order place karna chahta hoon:\n\n` +
      `${orderList}\n` +
      `💰 *Total Bill:* Rs. ${totalPrice.toLocaleString("en-PK")}\n` +
      `🏷️ *Promo Applied:* NEXURA20 (Flat 20% OFF eligible)\n` +
      `🚚 *Delivery:* Cash on Delivery (COD)\n\n` +
      `Kindly mera order confirm karein aur shipping address note karein.`
    );

    window.open(`https://wa.me/923219404812?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111] border-l border-[#c5a880]/30 p-6 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="font-display text-lg text-frost uppercase tracking-widest font-bold flex items-center gap-2">
              <span>🛍️</span> Shopping Bag ({items.length})
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-frost/50 hover:text-[#c5a880] text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-grow overflow-y-auto py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-frost/40 text-xs tracking-wider uppercase">
                Aapka Cart khali hai.
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const p = product.price_pkr ?? (product as any).price ?? 0;
                return (
                  <div key={product.id} className="flex gap-4 p-3 rounded bg-white/[0.02] border border-white/5 items-center">
                    <img 
                      src={product.image_url || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80"} 
                      alt={product.name} 
                      className="w-16 h-20 object-cover rounded border border-white/10"
                    />
                    <div className="flex-grow">
                      <h4 className="text-xs text-frost font-medium line-clamp-1">{product.name}</h4>
                      <p className="text-[#c5a880] text-xs font-bold mt-1">{formatPrice(p)}</p>
                      
                      {/* Qty Buttons */}
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white/5 border border-white/10 text-frost text-xs rounded hover:border-[#c5a880]"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono text-frost">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white/5 border border-white/10 text-frost text-xs rounded hover:border-[#c5a880]"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="text-[10px] text-red-400 hover:underline ml-auto"
                        >
                          Hatao
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-frost/60 uppercase tracking-wider text-xs">Total Bill:</span>
                <span className="text-lg font-bold text-[#c5a880] font-mono">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 bg-[#c5a880] hover:bg-[#d6bc96] text-black font-bold uppercase tracking-widest text-xs rounded transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span> Checkout on WhatsApp (COD)
              </button>
              <button
                onClick={clearCart}
                className="w-full text-center text-[10px] text-frost/40 hover:text-frost/70 uppercase tracking-widest"
              >
                Cart Khali Karein
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
