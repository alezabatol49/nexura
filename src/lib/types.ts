export type Product = {
  id: string;
  name: string;
  category: string;
  gender: string;
  price_pkr: number;
  compare_price_pkr: number | null;
  description: string;
  image_url: string;
  image_url_2: string | null;
  sizes: string[];
  colors: string[];
  rating: number;
  badge: string | null;
  in_stock: boolean;
  created_at: string;
};

export const ADMIN_CATEGORIES = [
  { slug: "kids", label: "Kids & Baby" },
  { slug: "women", label: "Women / Girls" },
  { slug: "men", label: "Men Collection" },
  { slug: "puffer-jackets", label: "Puffer Jackets" },
  { slug: "arctic-parkas", label: "Arctic Parkas" },
  { slug: "hoodies", label: "Heavyweight Hoodies" },
  { slug: "cashmere-sweaters", label: "Cashmere Sweaters" },
  { slug: "gloves", label: "Accessories" },
  { slug: "thermal-socks", label: "Thermal Socks" },
  { slug: "balaclavas", label: "Balaclavas" },
] as const;

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "0-3M", "3-6M", "6-12M", "1-2Y", "2-4Y"] as const;
export const ALL_GENDERS = ["men", "women", "kids", "unisex"] as const;
export const ADMIN_PIN = "9404";

export type CurrencyCode = "PKR" | "USD" | "AED" | "GBP";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  PKR: { code: "PKR", symbol: "Rs", label: "PKR", rate: 1 },
  USD: { code: "USD", symbol: "$", label: "USD", rate: 1 / 278 },
  AED: { code: "AED", symbol: "AED", label: "AED", rate: 1 / 75.6 },
  GBP: { code: "GBP", symbol: "£", label: "GBP", rate: 1 / 352 },
};

export const WHATSAPP_NUMBER = "923001700927";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CATEGORIES = [
  { slug: "all", label: "All Collections", icon: "All" },
  { slug: "kids", label: "Kids & Baby", icon: "Kids" },
  { slug: "women", label: "Women / Girls", icon: "Women" },
  { slug: "men", label: "Men Collection", icon: "Men" },
  { slug: "puffer-jackets", label: "Puffer Jackets", icon: "Puffer" },
  { slug: "arctic-parkas", label: "Arctic Parkas", icon: "Parka" },
  { slug: "hoodies", label: "Heavyweight Hoodies", icon: "Hoodie" },
  { slug: "cashmere-sweaters", label: "Cashmere Sweaters", icon: "Cashmere" },
  { slug: "gloves", label: "Leather Gloves", icon: "Gloves" },
  { slug: "thermal-socks", label: "Thermal Socks", icon: "Socks" },
  { slug: "balaclavas", label: "Balaclavas", icon: "Balaclava" },
] as const;

export function formatPrice(pkr: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency];
  const converted = pkr * info.rate;
  if (currency === "PKR") {
    return `${info.symbol} ${Math.round(converted).toLocaleString("en-PK")}`;
  }
  return `${info.symbol}${converted.toFixed(2)}`;
}

export function buildWhatsAppOrderLink(opts: {
  product: Product;
  size?: string;
  color?: string;
  quantity?: number;
  currency: CurrencyCode;
  customerName?: string;
  method?: "COD" | "WhatsApp";
}): string {
  const { product, size, color, quantity, currency, method } = opts;
  const price = formatPrice(product.price_pkr, currency);
  const lines = [
    `*NEXURA — New Order*`,
    ``,
    `*Product:* ${product.name}`,
    `*Size:* ${size ?? "M"}`,
    `*Color:* ${color ?? product.colors[0] ?? "Obsidian"}`,
    `*Quantity:* ${quantity ?? 1}`,
    `*Price:* ${price} (${currency})`,
    `*Payment:* ${method === "WhatsApp" ? "WhatsApp Confirmation" : "Cash on Delivery"}`,
    ``,
    `*Customer Details*`,
    `Name: `,
    `Phone: `,
    `Address: `,
    `City: `,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `${WHATSAPP_LINK}?text=${text}`;
}

export interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (pkr: number) => string;
}
