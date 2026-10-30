import { Snowflake, Truck, MessageCircle } from "lucide-react";

const items = [
  { icon: Snowflake, text: "Winter Drop Live" },
  { icon: Truck, text: "Cash on Delivery Available Across Pakistan" },
  { icon: MessageCircle, text: "WhatsApp: 0300-1700927" },
];

export default function TopBar() {
  return (
    <div className="bg-obsidian-50 border-b border-frost/5 overflow-hidden">
      <div className="flex items-center justify-center gap-10 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase text-frost/60">
        {items.map((item, i) => (
          <div key={i} className="hidden md:flex items-center gap-2">
            <item.icon size={11} className="text-gold" />
            <span>{item.text}</span>
          </div>
        ))}
        {/* Mobile: marquee */}
        <div className="md:hidden flex overflow-hidden w-full">
          <div className="marquee-track animate-marquee">
            {[...items, ...items, ...items].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-6 shrink-0">
                <item.icon size={10} className="text-gold" />
                <span>{item.text}</span>
                <span className="text-gold">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
