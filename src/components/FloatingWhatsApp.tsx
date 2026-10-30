import React from "react";

export default function FloatingWhatsApp() {
  const handleOpenHelp = () => {
    const text = encodeURIComponent(
      `*Assalam-o-Alaikum NEXURA.PK!*\n\nMujhe store collection aur order placement ke bare mein help chahiye.`
    );
    window.open(`https://wa.me/923001700927?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      <button
        type="button"
        onClick={handleOpenHelp}
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Direct WhatsApp Help"
      >
        {/* Pulse effect ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping -z-10"></span>

        {/* WhatsApp Official SVG Icon */}
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 2c-5.508 0-9.984 4.477-9.984 9.984 0 1.761.458 3.479 1.328 4.996l-1.41 5.156 5.285-1.387c1.465.799 3.117 1.22 4.781 1.22 5.508 0 9.984-4.477 9.984-9.984 0-5.508-4.476-9.985-9.984-9.985zm5.836 14.153c-.244.685-1.42 1.309-1.961 1.353-.518.043-1.189.062-3.411-.859-2.842-1.178-4.668-4.072-4.81-4.26-.142-.188-1.144-1.523-1.144-2.906 0-1.383.725-2.062.981-2.344.256-.282.56-.352.748-.352.188 0 .376.002.539.01.173.008.406-.066.635.484.236.567.807 1.97.877 2.113.07.143.117.311.023.499-.094.188-.141.305-.281.472-.14.167-.295.372-.422.5-.141.142-.288.297-.124.579.164.282.729 1.205 1.564 1.949 1.074.957 1.979 1.254 2.261 1.395.282.141.447.117.611-.071.164-.188.705-.823.893-1.105.188-.282.376-.235.634-.141.258.094 1.637.772 1.919.913.282.141.47.212.54.329.071.118.071.683-.173 1.368z"/>
        </svg>

        <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase font-mono">
          WhatsApp Order
        </span>
      </button>
    </div>
  );
}
