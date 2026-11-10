import { RegionWatchProviders, TitleSummary } from "../api/types";
import { tmdbIdsFor } from "../constants/providers";
import {
  excludeTitles,
  isStreamingOn,
  mergeByPopularity,
  mergeUniqueTitles,
  streamingEntries,
} from "../utils/filtering";

const title = (key: string, popularity = 1): TitleSummary => ({
  key,
  id: Number(key.split("-")[1]),
  mediaType: "movie",
  title: key,
  posterPath: "/poster.jpg",
  backdropPath: null,
  rating: 7,
  popularity,
  genreIds: [],
  overview: "",
});

const provider = (provider_id: number) => ({
  provider_id,
  provider_name: `Provider ${provider_id}`,
  logo_path: "/logo.png",
});

describe("streamingEntries", () => {
  it("includes subscription, free and ad-supported services only", () => {
    const regionData: RegionWatchProviders = {
      flatrate: [provider(8)],
      free: [provider(323)],
      ads: [provider(338)],
      rent: [provider(2)],
      buy: [provider(3)],
    };
    expect(streamingEntries(regionData).map((p) => p.provider_id)).toEqual([
      8, 323, 338,
    ]);
  });

  it("returns an empty list for a country without data", () => {
    expect(streamingEntries(undefined)).toEqual([]);
  });
});

describe("isStreamingOn", () => {
  const regionData: RegionWatchProviders = { flatrate: [provider(8)] };

  it("matches when one selected service has the title", () => {
    expect(isStreamingOn(regionData, [337, 8])).toBe(true);
  });

  it("does not match other services", () => {
    expect(isStreamingOn(regionData, [337])).toBe(false);
  });

  it("does not count rent-only titles", () => {
    expect(isStreamingOn({ rent: [provider(8)] }, [8])).toBe(false);
  });

  it("does not match when no services are selected", () => {
    expect(isStreamingOn(regionData, [])).toBe(false);
  });
});

describe("tmdbIdsFor", () => {
  it("returns the ids for the two selected services", () => {
    expect(tmdbIdsFor(["netflix", "disney"], "FI")).toEqual([8, 337]);
  });

  it("leaves out services that are not offered in the country", () => {
    expect(tmdbIdsFor(["areena", "netflix"], "SE")).toEqual([8]);
  });
});

describe("merging titles", () => {
  it("removes duplicates and keeps the first position", () => {
    const merged = mergeUniqueTitles(
      [title("movie-1"), title("movie-2")],
      [title("movie-2"), title("movie-3")],
    );
    expect(merged.map((t) => t.key)).toEqual([
      "movie-1",
      "movie-2",
      "movie-3",
    ]);
  });

  it("sorts merged lists by TMDB popularity", () => {
    const merged = mergeByPopularity(
      [title("movie-1", 5)],
      [title("tv-2", 9), title("movie-3", 7)],
    );
    expect(merged.map((t) => t.key)).toEqual(["tv-2", "movie-3", "movie-1"]);
  });

  it("removes titles the user already has", () => {
    const remaining = excludeTitles(
      [title("movie-1"), title("movie-2")],
      [title("movie-1")],
    );
    expect(remaining.map((t) => t.key)).toEqual(["movie-2"]);
  });
});
