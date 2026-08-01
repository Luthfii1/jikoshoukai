"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY = "jikoshoukai-recs";

const NOTE_COLORS = ["#FFF8E8", "#F5F0FF", "#EAF6F0", "#FFF0EB", "#F0F4FA"];
const NOTE_ROTATIONS = [-3, 2, -1.5, 3.5, -2.5, 1, -4, 2.5];

export function ClosingBeat() {
  const { t, locale } = useLocale();
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [recs, setRecs] = useState<string[]>([]);
  const [url, setUrl] = useState("https://github.com/Luthfii1/jikoshoukai");

  useEffect(() => {
    setUrl(window.location.origin + window.location.pathname);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setRecs(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recs].slice(0, 20);
    setRecs(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setValue("");
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <section
      id="beat-closing"
      data-atmosphere="warm"
      className="beat grain relative flex items-center overflow-hidden bg-[var(--bg-warm)]"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:px-10 md:pl-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white"
          >
            {t.closing.holiday}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-3 text-3xl font-bold text-[var(--ink)] md:text-4xl ${
              locale === "en" ? "en-display" : "display"
            }`}
          >
            {t.closing.headline}
          </motion.h2>
          <p className="mb-2 text-2xl font-bold text-[var(--accent-deep)] md:text-3xl">
            {t.closing.highlight}
          </p>
          <p className="mb-8 max-w-lg text-[var(--ink-soft)]">{t.closing.body}</p>

          <form
            onSubmit={onSubmit}
            className="mb-4 flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="rec-input">
              {t.closing.placeholder}
            </label>
            <input
              id="rec-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t.closing.placeholder}
              className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--ink-mute)] focus:ring-2"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            >
              {t.closing.submit}
            </button>
          </form>

          <AnimatePresence>
            {done && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 text-sm font-medium text-[var(--accent-deep)]"
              >
                {t.closing.submitted}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Sticky notes wall */}
          <div className="relative mb-8 min-h-[140px]">
            {recs.length === 0 ? (
              <p className="text-sm text-[var(--ink-mute)]">
                {locale === "ja"
                  ? "おすすめがここに付箋として溜まっていきます。"
                  : "Recommendations will pile up here as sticky notes."}
              </p>
            ) : (
              <ul className="relative flex min-h-[160px] flex-wrap gap-3 pt-2">
                <AnimatePresence initial={false}>
                  {recs.slice(0, 10).map((r, i) => (
                    <motion.li
                      key={`${r}-${i}`}
                      initial={{ opacity: 0, scale: 0.7, y: -12, rotate: -8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotate: NOTE_ROTATIONS[i % NOTE_ROTATIONS.length],
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className="relative max-w-[140px] px-3 pt-4 pb-3 text-sm leading-snug text-[var(--ink)] shadow-[2px_3px_8px_rgba(26,26,46,0.1)]"
                      style={{
                        background: NOTE_COLORS[i % NOTE_COLORS.length],
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute top-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent)]/70"
                      />
                      {r}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <p
            className={`text-2xl font-bold text-[var(--ink)] ${
              locale === "en" ? "en-display" : "display"
            }`}
          >
            {t.closing.signOff}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center self-center rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-[0_20px_60px_rgba(26,26,46,0.06)]">
          <QRCodeSVG
            value={url}
            size={160}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
            level="M"
            className="mb-4"
          />
          <p className="mb-1 text-sm font-medium text-[var(--ink)]">
            {t.closing.qrCaption}
          </p>
          <p className="break-all text-xs text-[var(--ink-mute)]">{url}</p>
        </div>
      </div>
    </section>
  );
}
