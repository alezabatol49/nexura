import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CurrencyCode, CURRENCIES } from "./types";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (pkrPrice: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "nexura-currency-v2";

const RATES: Record<CurrencyCode, number> = {
  PKR: 1,
  USD: 0.0036,
  EUR: 0.0033,
  GBP: 0.0028,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  PKR: "Rs. ",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES && CURRENCIES[stored]) return stored;
    return "PKR";
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const formatPrice = (pkrPrice: number): string => {
    const val = Number(pkrPrice) || 0;
    if (currency === "PKR") {
      return `Rs. ${val.toLocaleString("en-PK")}`;
    }
    const rate = RATES[currency] || 1;
    const sym = SYMBOLS[currency] || "Rs. ";
    return `${sym}${(val * rate).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
