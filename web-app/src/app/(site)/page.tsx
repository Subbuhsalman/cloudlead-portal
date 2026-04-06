"use client";
import Image from "next/image";
import { Sparkles, Check, X, ArrowRight } from 'lucide-react';
import CheckmarkItem from '@/components/ui/CheckmarkItem';
import CapabilityItem from '@/components/ui/CapabilityItem';
import ContentCard from '@/components/ui/ContentCard';
import FAQItem from '@/components/ui/FAQItem';
import FeatureCard from '@/components/ui/FeatureCard';
import AppStoreBadge from "@/components/ui/AppStoreBadge";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import PhoneValidationSection from "@/components/PhoneValidationSection";
import StatsRowSection from "@/components/StatsRowSection";
import ChannelOptimizedHero from "@/components/ChannelOptimizedHero";

export default function Home() {

  const router = useRouter();
  return (
    <>
      <ChannelOptimizedHero />

      <StatsRowSection />

      <PhoneValidationSection />


      {/* Footer */}
      <TestimonialsSection />


      <Footer />
    </>
  );
}
