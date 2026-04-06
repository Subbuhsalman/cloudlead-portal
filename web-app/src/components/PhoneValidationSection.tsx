import React from "react";
import { PhoneCall, Calendar } from "lucide-react";

/**
 * Phone Validation Section — React + Tailwind
 * Pixel‑accurate to the provided reference (left image with overlay KPI card,
 * right copy with green highlights and icon bullets.)
 */

export default function PhoneValidationSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:gap-14 lg:gap-20">
        {/* Media */}
        <div className="order-2 md:order-1">
          <div className="relative rounded-2xl shadow-[0_20px_60px_rgba(10,76,70,0.15)]">
            <img
              src="/assets/icons/phone-validation.svg"
              alt="Happy rep on a call during validation"
              className="h-[360px] w-full rounded-2xl object-cover md:h-[420px]"
              loading="lazy"
            />

          </div>
        </div>

        {/* Copy */}
        <div className="order-1 md:order-2">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-gray-700">
            Phone Validation
          </p>

          <h2 className="text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">
            Spend less time dialing or leaving voice mails and
            <br className="hidden sm:block" />
            <span className="text-emerald-500"> more time talking to your</span>
            <br className="hidden sm:block" />
            <span className="text-emerald-500"> prospects.</span>
          </h2>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-gray-600">
            With human researchers and tools, Cloudlead verifies emails and updates all your existing
            data points. This includes:
          </p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3 text-gray-800">
              <span className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <PhoneCall className="h-5 w-5" />
              </span>
              <span className="pt-0.5">People who tend to pick up</span>
            </li>
            <li className="flex items-start gap-3 text-gray-800">
              <span className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Calendar className="h-5 w-5" />
              </span>
              <span className="pt-0.5">Time stamped so you know when to call</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
