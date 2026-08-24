import type { ReactNode } from "react";

/**
 * Heading block for the SEO landing pages. The copy under the fold is real
 * buying guidance, not keyword filler — it is what makes these pages worth
 * indexing.
 */
export function LandingIntro({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-4 mb-6 lg:mb-8">
      <h1 className="font-display text-2xl font-extrabold text-balance text-steel-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-pretty text-steel-600 sm:text-base">
        {subtitle}
      </p>
      {children}
    </div>
  );
}

/** Long-form guidance rendered below the results grid. */
export function LandingCopy({
  heading,
  paragraphs,
}: {
  heading: string;
  paragraphs: string[];
}) {
  return (
    <section className="mt-14 border-t border-steel-200 pt-10">
      <h2 className="font-display text-xl font-bold text-steel-900">
        {heading}
      </h2>
      <div className="mt-4 max-w-3xl space-y-4">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="leading-relaxed text-pretty text-steel-600"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
