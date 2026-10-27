import React from "react";
import { useCart } from "../lib/CartContext";
import { useCurrency } from "../lib/CurrencyContext";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let orderList = "";
    items.forEach((item, index) => {
      const price = item.product.price_pkr ?? (item.product as any).price ?? 0;
      orderList += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) - ${formatPrice(price * item.quantity)}\n`;
    });

    const msg = encodeURIComponent(
      `*Assalam-o-Alaikum NEXURA.PK!*\n\nMain ye items Cash on Delivery par order karna chahta hoon:\n\n${orderList}\n💰 *Total Amount:* ${formatPrice(totalPrice)}\n\nDelivery details:\nName:\nPhone:\nAddress:\nCity:`
    );

    window.open(`https://wa.me/923219404812?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col text-frost">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              <h2 className="font-display text-sm font-bold tracking-widest uppercase text-[#c5a880]">
                Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-frost/50 hover:text-white p-1 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-frost/40">
                <span className="text-4xl block mb-2">🛒</span>
                <p className="text-xs uppercase tracking-wider">Aapka cart khali hai</p>
              </div>
            ) : (
              items.map((item) => {
                const price = item.product.price_pkr ?? (item.product as any).price ?? 0;
                return (
                  <div key={item.product.id} className="flex gap-3 bg-white/[0.02] p-3 rounded border border-white/5 items-center justify-between">
                    <img 
                      src={item.product.image_url || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=200&q=80"} 
                      alt={item.product.name}
                      className="w-14 h-16 object-cover rounded bg-neutral-900 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-frost truncate">{item.product.name}</h4>
                      <p className="text-xs font-bold text-[#c5a880] mt-1 font-mono">
                        {formatPrice(price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-xs hover:bg-white/20"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-xs hover:bg-white/20"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-frost/40 hover:text-red-400 text-xs p-1"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-black/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-frost/60 uppercase">Subtotal</span>
                <span className="text-sm font-bold text-[#c5a880]">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold py-3 rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                <span>Order on WhatsApp (COD)</span>
              </button>
              <button
                onClick={clearCart}
                className="w-full text-[10px] text-frost/40 hover:text-frost/70 uppercase tracking-wider py-1"
              >
                Clear Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
} 

