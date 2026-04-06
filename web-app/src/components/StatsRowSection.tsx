import React from "react";

/**
 * Stats Row Section — React + Tailwind
 * Background color #e5f4f4, percent text color #11423f
 */

const STATS = [
  {
    value: "70%",
    text: "Connect ratio on phone validated leads/8x increase in connect rates",
  },
  {
    value: "30%",
    text: "Increased response on social media outreach",
  },
  {
    value: "60%",
    text: "Increase in opens with email predictability",
  },
  {
    value: "50%",
    text: "More responses with our combined insights on lead generation campaigns",
  },
];

export default function StatsRowSection() {
  return (
    <section className="w-full bg-[#e5f4f4] py-14">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 md:flex-row md:gap-0">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className={`flex-1 text-center md:text-left ${
              idx !== STATS.length - 1 ? "md:border-r md:border-gray-300" : ""
            } md:px-6`}
          >
            <div className="text-3xl font-regular text-[#11423f] sm:text-5xl">
              {stat.value}
            </div>
            <p className="mt-2 max-w-xs text-sm text-gray-700 md:max-w-none">
              {stat.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
Usage
-----
import StatsRowSection from "./StatsRowSection";

<StatsRowSection />

Notes
-----
- Background color fixed to #e5f4f4
- Percent text color fixed to #11423f
- Responsive: stacks vertically on mobile, horizontal row with dividers on md+
*/
