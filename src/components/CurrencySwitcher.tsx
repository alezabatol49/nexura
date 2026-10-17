import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency } from "../lib/CurrencyContext";
import { CURRENCIES, CurrencyCode } from "../lib/types";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const current = CURRENCIES[currency];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-frost/80 hover:text-frost transition-colors"
        aria-label="Switch currency"
      >
        <span>{current.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-3 z-50 w-32 bg-obsidian-50 border border-frost/10 py-2 animate-fade-in">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-[11px] tracking-widest uppercase text-frost/70 hover:bg-frost/5 hover:text-frost transition-colors"
              >
                <span>{CURRENCIES[code].label}</span>
                {currency === code && <Check size={12} className="text-gold" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
