import { MediaType, TitleSummary } from "../api/types";

const TV_TO_MOVIE_GENRE: Record<number, number[]> = {
  10759: [28, 12],
  10765: [878, 14],
  10768: [10752],
};

const MOVIE_TO_TV_GENRE: Record<number, number> = {
  28: 10759,
  12: 10759,
  878: 10765,
  14: 10765,
  10752: 10768,
};

const TV_GENRES = new Set([
  10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766,
  10767, 10768, 37,
]);

export const canonicalGenres = (ids: number[] = []) =>
  Array.from(new Set(ids.flatMap((id) => TV_TO_MOVIE_GENRE[id] ?? [id])));

export const genresFor = (mediaType: MediaType, canonical: number[]) =>
  mediaType === "movie"
    ? canonical
    : Array.from(
        new Set(
          canonical
            .map((id) => MOVIE_TO_TV_GENRE[id] ?? id)
            .filter((id) => TV_GENRES.has(id)),
        ),
      );

const genreSimilarity = (a: number[], b: number[]) => {
  const ca = canonicalGenres(a);
  const cb = canonicalGenres(b);
  const shared = ca.filter((g) => cb.includes(g)).length;
  const union = new Set([...ca, ...cb]).size;
  return union === 0 ? 0 : shared / union;
};

export const tasteGenres = (taste: TitleSummary[], limit = 3) => {
  const counts = new Map<number, number>();
  taste.forEach((t) =>
    canonicalGenres(t.genreIds).forEach((g) =>
      counts.set(g, (counts.get(g) ?? 0) + 1),
    ),
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([g]) => g);
};

export const rankByTaste = (
  candidates: TitleSummary[],
  taste: TitleSummary[],
) => {
  const seen = new Set(taste.map((t) => t.key));
  const score = (c: TitleSummary) =>
    (taste.length === 0
      ? 0
      : Math.max(...taste.map((t) => genreSimilarity(c.genreIds, t.genreIds))) *
        10) +
    c.rating / 2;

  const unique = new Map(candidates.map((c) => [c.key, c]));
  return [...unique.values()]
    .filter((c) => !seen.has(c.key))
    .sort((a, b) => score(b) - score(a));
};

export const rankBySimilarity = (
  candidates: TitleSummary[],
  base: TitleSummary,
) =>
  candidates
    .filter((c) => c.key !== base.key)
    .sort(
      (a, b) =>
        genreSimilarity(b.genreIds, base.genreIds) * 10 +
        b.rating / 2 -
        (genreSimilarity(a.genreIds, base.genreIds) * 10 + a.rating / 2),
    );

export const mergeByPopularity = (...lists: TitleSummary[][]) =>
  lists.flat().sort((a, b) => b.popularity - a.popularity);
