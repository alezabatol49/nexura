import { Snowflake, ShieldCheck, Truck, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Snowflake,
    title: "Arctic-Grade Warmth",
    text: "Rated to -30°C with responsibly-sourced down and thermal membranes.",
  },
  {
    icon: ShieldCheck,
    title: "Crafted to Last",
    text: "Premium materials and reinforced construction for seasons of wear.",
  },
  {
    icon: Truck,
    title: "COD Across Pakistan",
    text: "Cash on delivery available nationwide. Pay when it arrives.",
  },
  {
    icon: MessageCircle,
    title: "1-Click WhatsApp Order",
    text: "Skip the checkout. Order any item instantly via WhatsApp.",
  },
];

export default function FeatureBar() {
  return (
    <section className="border-y border-frost/10 bg-obsidian-100">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-frost/10">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-start gap-3 p-6 lg:p-8">
            <f.icon size={22} className="text-gold" strokeWidth={1.5} />
            <h3 className="text-xs tracking-[0.2em] uppercase text-frost font-medium">{f.title}</h3>
            <p className="text-[12px] text-frost/50 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
