"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { formatNumber } from "@/lib/utils/format-number";
import { MarketplaceSearch } from "./marketplace-search";

const assurances = [
  { icon: BadgeCheck, label: "Verified sellers" },
  { icon: Wrench, label: "Inspected vehicles" },
  { icon: ShieldCheck, label: "Documents checked" },
];

const heroSlides = [
  {
    image: "/images/hero/hero-1.png",
    title: "Heavy Duty Haulage & Multi-Axle Trucks",
    subtitle: "Ashok Leyland, Tata Motors & BharatBenz Heavy Commercial Vehicles",
  },
  {
    image: "/images/hero/hero-2.png",
    title: "Tippers & Construction Vehicles",
    subtitle: "High Payload Tippers & Infrastructure Transport Equipment",
  },
  {
    image: "/images/hero/hero-3.png",
    title: "Light Commercial Vehicles & Pickups",
    subtitle: "Tata Ace, Mahindra Bolero & City Delivery Mini Trucks",
  },
];

export interface HeroProps {
  totalListings: number;
  cities: number;
}

export function Hero({ totalListings, cities }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative isolate overflow-hidden bg-steel-950 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex flex-col justify-center">
      {/* 3-Image Auto-Scrolling Background Banner */}
      {heroSlides.map((slide, idx) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover object-center transform scale-105 transition-transform duration-10000 ease-linear"
          />
        </div>
      ))}

      {/* Light scrim shadow overlay — keeps images bright, crisp & 100% visible while preserving WCAG contrast */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-steel-950/85 via-steel-950/50 to-transparent z-10"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-steel-950/80 to-transparent z-10"
      />

      <PageContainer className="relative z-20 py-12 sm:py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
            <span className="size-2 rounded-full bg-trust-400 animate-pulse" />
            {formatNumber(totalListings)} live listings across {cities} cities
          </p>

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-[3.5rem] drop-shadow-md">
            India&rsquo;s commercial vehicle marketplace,{" "}
            <span className="text-brand-400 underline decoration-brand-500/50 underline-offset-4">built on trust</span>
          </h1>

          <p className="mt-4 max-w-xl text-base text-pretty text-steel-100 sm:text-lg font-medium drop-shadow-sm">
            Buy and sell trucks, pickups, tippers, tankers and buses with
            verified documents, inspection reports and transparent pricing.
          </p>

          {/* Search Box */}
          <div className="mt-7">
            <MarketplaceSearch />
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {assurances.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm font-semibold text-white drop-shadow-xs"
              >
                <item.icon aria-hidden className="size-4 text-trust-400" />
                {item.label}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/sell"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-500 hover:shadow-lg"
            >
              Sell your vehicle free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/finance"
              className="rounded-lg border border-white/30 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              Check finance options
            </Link>
          </div>
        </div>
      </PageContainer>

      {/* 3-Slide Navigation Controls & Indicator Dots */}
      <div className="absolute right-4 bottom-6 sm:right-8 sm:bottom-8 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="grid size-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "w-8 bg-brand-500" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="grid size-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
