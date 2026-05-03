const VERCEL_BASE = "https://malenastrauch.vercel.app";
const MANIFEST_URL = "/gallery-manifest.json";

type RawEntry = { public_id: string; filename: string; url: string };

export type YearEntry = { filename: string; url: string };

let manifestCache: RawEntry[] | null = null;

async function fetchManifest(): Promise<RawEntry[]> {
  if (manifestCache) return manifestCache;
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error("manifest not found");
  manifestCache = await res.json();
  return manifestCache!;
}

async function fetchFromApi(year: string): Promise<RawEntry[]> {
  const res = await fetch(`${VERCEL_BASE}/api/getImages?year=${year}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.resources || [];
}

export async function loadYearEntries(year: string): Promise<YearEntry[]> {
  let raw: RawEntry[];
  try {
    const all = await fetchManifest();
    raw = all.filter(r => r.public_id.includes(`/gallery/${year}/`));
  } catch {
    raw = await fetchFromApi(year);
  }
  const list = raw.map(r => ({ filename: r.filename, url: r.url }));
  list.sort((a, b) => a.filename.localeCompare(b.filename));
  return list;
}

export function toThumbnailUrl(url: string): string {
  return url.replace("/upload/", "/upload/w_300,h_300,c_fill/");
}

export function toProtectedUrl(url: string): string {
  return url.replace("/upload/", "/upload/w_1800,c_limit,q_85/");
}
