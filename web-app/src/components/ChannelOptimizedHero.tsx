import React from "react";

/**
 * Channel Optimized Data — Hero Section (React + Tailwind)
 * Matches the provided design:
 * - Dark teal background
 * - Left: eyebrow, headline with manual line breaks, body, 2 CTA buttons
 * - Right: floating contact card with three rows and concentric dotted rings behind
 */

export default function ChannelOptimizedHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#123c39] py-16 text-white sm:py-20">
      {/* dotted rings background */}
      <div className="pointer-events-none absolute right-[-10%] top-10 hidden h-[520px] w-[520px] -translate-x-14 md:block">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-dashed border-white/20" />
        <div className="absolute inset-16 rounded-full border border-dashed border-white/20" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 md:grid-cols-2">
        {/* Left Copy */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
            Channel Optimized Data
          </p>

          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Know whether your leads
             are likely to respond on
             Email, Phone or Social.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-emerald-100/90">
            Cloudlead provides human-verified leads, combining software scalability with human precision to mine for
            custom sales triggers that indicate strong buying intent.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#0d2d2a] shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:bg-emerald-300"
            >
              Book A Call
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300/50 bg-transparent px-5 py-3 text-sm font-semibold text-emerald-200 hover:border-emerald-200"
            >
              Request Sample Data
            </a>
          </div>
        </div>

        {/* Right mock card */}
        <div className="relative">
          <div className="relative rounded-2xl border border-white/10 bg-white/95 p-6 text-[#1f2a2a] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="absolute -inset-2 rounded-2xl bg-emerald-300/20 blur-sm" aria-hidden />
            <div className="relative rounded-xl border border-emerald-200 bg-white p-5">
              {[
                { name: "Adam shoks", cadence: "Social", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=96&h=96&fit=crop&crop=faces" },
                { name: "Mario Willium", cadence: "Email", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=96&h=96&fit=crop&crop=faces" },
                { name: "Dianne Russell", cadence: "Phone", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=96&h=96&fit=crop&crop=faces" },
              ].map((row, i) => (
                <div key={row.name} className={`flex items-center justify-between gap-4 ${i !== 0 ? 'mt-5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <img src={row.img} alt={row.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="text-[15px] font-semibold text-slate-800">{row.name}</div>
                      <div className="mt-2 h-2 w-48 rounded bg-slate-100" />
                      <div className="mt-2 h-2 w-40 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="text-right text-[13px]">
                    <div className="text-slate-500">Cadence:</div>
                    <div className="font-semibold text-slate-800">{row.cadence}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
