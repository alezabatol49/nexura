export default function Editorial() {
  return (
    <section className="grid md:grid-cols-2 min-h-[60vh]">
      {/* Left image */}
      <div className="relative h-[50vh] md:h-auto overflow-hidden img-zoom">
        <img
          src="https://images.pexels.com/photos/20104167/pexels-photo-20104167.jpeg?auto=compress&cs=tinysrgb&h=1000"
          alt="NEXURA arctic parka editorial"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/20" />
      </div>

      {/* Right text */}
      <div className="flex flex-col justify-center p-10 lg:p-20 bg-obsidian-100">
        <p className="section-label mb-6 text-gold">The Philosophy</p>
        <h2 className="font-display text-3xl md:text-5xl text-frost font-bold leading-[1.1] mb-6">
          Luxury isn't seasonal.
          <br />
          It's structural.
        </h2>
        <p className="text-sm text-frost/60 leading-relaxed max-w-md mb-8">
          Every NEXURA piece is built from the inside out — thermal membranes, responsibly-sourced down, and hardware that performs in the harshest winters. The silhouette is editorial. The engineering is arctic.
        </p>
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-3xl text-gold font-bold">-30°</span>
            <span className="text-[11px] tracking-wider text-frost/50 uppercase">Cold-rated construction</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-3xl text-gold font-bold">520</span>
            <span className="text-[11px] tracking-wider text-frost/50 uppercase">GSM heavyweight fleece</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-3xl text-gold font-bold">100%</span>
            <span className="text-[11px] tracking-wider text-frost/50 uppercase">Pure cashmere knits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
