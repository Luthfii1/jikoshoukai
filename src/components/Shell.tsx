"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { BEAT_IDS } from "@/lib/beats";
import { usePresentation } from "@/contexts/PresentationContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-[var(--line)] bg-white/80 p-0.5 backdrop-blur-md"
      role="group"
      aria-label="Language"
    >
      {(["ja", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium tracking-wide transition-colors ${
            locale === code
              ? "bg-[var(--ink)] text-white"
              : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          }`}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function ProgressDots() {
  const { beatIndex, goToBeat, isPresent } = usePresentation();
  if (isPresent) return null;

  return (
    <nav
      className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="Sections"
    >
      {BEAT_IDS.map((id, i) => (
        <button
          key={id}
          type="button"
          onClick={() => goToBeat(i)}
          aria-label={id}
          aria-current={i === beatIndex ? "true" : undefined}
          className={`h-2 w-2 rounded-full transition-all ${
            i === beatIndex
              ? "scale-125 bg-[var(--accent)]"
              : "bg-[var(--line)] hover:bg-[var(--ink-mute)]"
          }`}
        />
      ))}
    </nav>
  );
}

export function TopBar() {
  const { isPresent } = usePresentation();
  const { t } = useLocale();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 md:px-6">
      <a
        href="#beat-hero"
        className="display text-sm font-bold tracking-tight text-[var(--ink)] md:text-base"
      >
        Luthfi
        <span className="ml-1.5 font-medium text-[var(--accent)]">ルフィ</span>
      </a>
      <div className="flex items-center gap-2">
        {!isPresent && (
          <a
            href="?present=1"
            className="hidden rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] backdrop-blur-md transition hover:border-[var(--accent)] hover:text-[var(--ink)] sm:inline-block"
          >
            {t.nav.present}
          </a>
        )}
        {isPresent && (
          <a
            href="/"
            className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] backdrop-blur-md transition hover:text-[var(--ink)]"
          >
            {t.nav.explore}
          </a>
        )}
        <LanguageToggle />
      </div>
    </header>
  );
}

export function PhotoSlot({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
