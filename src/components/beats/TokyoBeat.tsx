"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { getPhoto } from "@/lib/photos";
import { PhotoSlot } from "@/components/Shell";

export function TokyoBeat() {
  const { t, locale } = useLocale();
  const a = getPhoto("tokyo-1", locale);
  const b = getPhoto("tokyo-2", locale);

  return (
    <section
      id="beat-tokyo"
      data-atmosphere="soft"
      className="beat flex items-center bg-[var(--bg-soft)]"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-24 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-12 text-3xl font-bold text-[var(--ink)] md:text-5xl ${
            locale === "en" ? "en-display" : "display"
          }`}
        >
          {t.tokyo.headline}
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { card: t.tokyo.cardA, photo: a },
            { card: t.tokyo.cardB, photo: b },
          ].map(({ card, photo }, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white"
            >
              <div className="relative h-44 overflow-hidden md:h-52">
                <PhotoSlot
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full transition duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--ink)] backdrop-blur">
                  {card.badge}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="mb-2 text-xl font-bold text-[var(--ink)]">
                  {card.title}
                </h3>
                <p className="text-[var(--ink-soft)]">{card.body}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 text-sm text-[var(--ink-mute)]">{t.tokyo.footnote}</p>
      </div>
    </section>
  );
}
