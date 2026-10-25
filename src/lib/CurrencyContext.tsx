import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CurrencyCode, CURRENCIES } from "./types";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "nexura-currency-v2"; // v2 کرنے سے پرانی USD کیشے ختم ہو جائے گی

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    // پرانی کیشے صاف کر کے ڈیفالٹ PKR رکھیں
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES[stored]) {
      return stored;
    }
    return "PKR";
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
