import React from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "The data is really high in quality and is very well positioned in the market. We are very happy to have partnered with Cloudlead.",
    name: "Tom U.",
    title: "Director, Business Development",
    avatarInitials: "TU",
    avatarSrc: "",
  },
  {
    quote:
      "They are able to take a list, and verify working email addresses as well as ensuring the phone numbers are accurate.",
    name: "Jason C.",
    title: "CEO",
    avatarInitials: "JC",
    avatarSrc:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&h=128&fit=crop&crop=faces",
  },
  {
    quote:
      "Willing to do whatever it takes. Very solid and cost effective resource for lead cleansing, enrichment and validations.",
    name: "Eric G.",
    title: "Director of Customer Engagement",
    avatarInitials: "EG",
    avatarSrc:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&h=128&fit=crop&crop=faces",
  },
];

const AWARDS = [
  { labelTop: "High Performer", icon:"/assets/icons/badge1.png", season: "SUMMER", year: "2022" },
  { labelTop: "Best Support", icon:"/assets/icons/badge2.png", season: "SUMMER", year: "2022" },
  { labelTop: "Best Meets Requirements", icon:"/assets/icons/badge3.png", season: "SUMMER", year: "2022" },
  { labelTop: "Users Most Likely To Recommend",  icon:"/assets/icons/badge4.png", season: "SUMMER", year: "2022" },
];

function Avatar({ src, initials }: { src?: string; initials: string }) {
  return src ? (
    <img
      src={src}
      alt={initials}
      className="h-12 w-12 rounded-full object-cover ring-4 ring-emerald-50"
      loading="lazy"
    />
  ) : (
    <div className="h-12 w-12 rounded-full bg-emerald-600 text-white grid place-items-center text-lg font-semibold ring-4 ring-emerald-50">
      {initials}
    </div>
  );
}

function AwardBadge(item:any) {
  return (
    <div className="relative mx-2 w-36">
        <img src={item?.icon}  className="w-full h-auto" />
    </div>
  );
}

const  TestimonialsSection = () => {
  return (
    <section className="isolate w-full overflow-hidden bg-[radial-gradient(80%_120%_at_50%_-10%,#2aa987_0%,#0b5e56_45%,#0a4c46_100%)] py-20 text-emerald-50">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Testimonials</h2>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <article
              key={idx}
              className="rounded-xl bg-white/95 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm"
            >
              <Quote className="h-7 w-7 text-emerald-700" />
              <p className="mt-4 text-[15px] leading-7 text-gray-700">“{t.quote}”</p>

              <div className="mt-6 flex items-center gap-3">
                <Avatar src={t.avatarSrc} initials={t.avatarInitials} />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.title}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Awards headline */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-emerald-100">
          Cloudlead has won multiple awards over the years
        </p>

        {/* Awards row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {AWARDS.map((a, i) => (
            <AwardBadge key={i} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection }


