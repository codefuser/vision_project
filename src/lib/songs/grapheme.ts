const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

export function truncateGraphemes(text: string, maxGraphemes: number): string {
  const segments = Array.from(segmenter.segment(text));
  if (segments.length <= maxGraphemes) return text;
  return segments
    .slice(0, maxGraphemes)
    .map((s) => s.segment)
    .join("");
}
