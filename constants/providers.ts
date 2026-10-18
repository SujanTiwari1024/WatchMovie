export type ProviderId =
  | "netflix"
  | "prime"
  | "appletv"
  | "disney"
  | "max"
  | "viaplay"
  | "areena"
  | "ruutu"
  | "skyshowtime"
  | "svtplay"
  | "hulu";

export type RegionCode = "FI" | "SE" | "US";

export interface Provider {
  id: ProviderId;
  name: string;
  color: string;
  tmdbIds: number[];
  logoPath: string;
  regions: RegionCode[];
  searchUrl: (title: string) => string;
}

const q = encodeURIComponent;

export const providers: Record<ProviderId, Provider> = {
  netflix: {
    id: "netflix",
    name: "Netflix",
    color: "#99040ca1",
    tmdbIds: [8],
    logoPath: "/rK1KljqmbvO9HQa1PBFLILWah72.png",
    regions: ["FI", "SE", "US"],
    searchUrl: (t) => `https://www.netflix.com/search?q=${q(t)}`,
  },
  prime: {
    id: "prime",
    name: "Prime Video",
    color: "#0235ef",
    tmdbIds: [119, 9],
    logoPath: "/gMZdpavHmxFNnLpMHwVxfqeux2g.png",
    regions: ["FI", "SE", "US"],
    searchUrl: (t) => `https://www.primevideo.com/search?phrase=${q(t)}`,
  },
  appletv: {
    id: "appletv",
    name: "Apple TV+",
    color: "#999999",
    tmdbIds: [350],
    logoPath: "/9icYBfYFcwgCbky5VdGUIKJ4C5i.png",
    regions: ["FI", "SE", "US"],
    searchUrl: (t) => `https://tv.apple.com/search?term=${q(t)}`,
  },
  disney: {
    id: "disney",
    name: "Disney+",
    color: "#6b779c",
    tmdbIds: [337],
    logoPath: "/5eZ872CghnHFLB1j8grszbrx0dx.png",
    regions: ["FI", "SE", "US"],
    searchUrl: (t) => `https://www.disneyplus.com/search?q=${q(t)}`,
  },
  max: {
    id: "max",
    name: "HBO Max",
    color: "#7B2CF5",
    tmdbIds: [1899],
    logoPath: "/skypuy7SXuugIQeYg0IglmzoKaS.png",
    regions: ["FI", "SE", "US"],
    searchUrl: (t) => `https://play.hbomax.com/search?q=${q(t)}`,
  },
  viaplay: {
    id: "viaplay",
    name: "Viaplay",
    color: "#E4002B",
    tmdbIds: [76],
    logoPath: "/c1J9PGGowXwW5AxAaZaGipeFu7U.png",
    regions: ["FI", "SE"],
    searchUrl: (t) => `https://viaplay.fi/search?query=${q(t)}`,
  },
  areena: {
    id: "areena",
    name: "Yle Areena",
    color: "#00B4C8",
    tmdbIds: [323],
    logoPath: "/panQnRtGRa7AofXjBpG55WssWTu.png",
    regions: ["FI"],
    searchUrl: (t) => `https://areena.yle.fi/hae?q=${q(t)}`,
  },
  ruutu: {
    id: "ruutu",
    name: "Ruutu",
    color: "#FF6600",
    tmdbIds: [338],
    logoPath: "/MY2vJySdvDiDQrIYUQgxJK1Sen.png",
    regions: ["FI"],
    searchUrl: (t) => `https://www.ruutu.fi/haku?q=${q(t)}`,
  },
  skyshowtime: {
    id: "skyshowtime",
    name: "SkyShowtime",
    color: "#1D1D6B",
    tmdbIds: [1773],
    logoPath: "/ube1pVpP3FklRkeyQjlDkkC3tL2.png",
    regions: ["FI", "SE"],
    searchUrl: () => "https://www.skyshowtime.com/",
  },
  svtplay: {
    id: "svtplay",
    name: "SVT Play",
    color: "#1D9E4C",
    tmdbIds: [493],
    logoPath: "/vMU9xqjyIsOplkdSCRveond8fxV.png",
    regions: ["SE"],
    searchUrl: (t) => `https://www.svtplay.se/sok?q=${q(t)}`,
  },
  hulu: {
    id: "hulu",
    name: "Hulu",
    color: "#1CE783",
    tmdbIds: [15],
    logoPath: "/44uAnmSqvA4yBOdbPWN8YgQHjWm.png",
    regions: ["US"],
    searchUrl: (t) => `https://www.hulu.com/search?q=${q(t)}`,
  },
};

const allProviders = Object.values(providers);

export const providersInRegion = (region: RegionCode) =>
  allProviders.filter((p) => p.regions.includes(region));

export const providerForTmdbId = (tmdbId: number) =>
  allProviders.find((p) => p.tmdbIds.includes(tmdbId));

export const tmdbIdsFor = (ids: ProviderId[], region: RegionCode) =>
  ids
    .map((id) => providers[id])
    .filter((p) => p && p.regions.includes(region))
    .flatMap((p) => p.tmdbIds);

export const regions: { code: RegionCode; name: string }[] = [
  { code: "FI", name: "Finland" },
  { code: "SE", name: "Sweden" },
  { code: "US", name: "United States" },
];

export const regionName = (code: RegionCode) =>
  regions.find((r) => r.code === code)?.name ?? code;
