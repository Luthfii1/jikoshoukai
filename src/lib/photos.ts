import manifest from "../../public/photos/manifest.json";

export type PhotoId = keyof typeof manifest;

export function getPhoto(id: PhotoId, locale: "ja" | "en") {
  const entry = manifest[id];
  return {
    src: entry.src,
    alt: entry.alt[locale],
    orient: entry.orient,
  };
}
