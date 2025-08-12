import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";

export type ImageEntry = {
  title: string;
  year: string;
  material: string;
  size: string;
  price: string;
  filename: string;
  url: string;
  thumbnailUrl: string; // thumbnail image
};

const BASE_URL = "https://malenastrauch.vercel.app"; // adjust if running locally

export function useGalleryImages(
  year: string,
  filter?: (img: ImageEntry) => boolean
) {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/api/getImages?year=${year}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch images: ${res.status} ${res.statusText}`
          );
        }

        const data: { total: number; resources: any[] } = await res.json();

        if (!Array.isArray(data.resources)) {
          throw new Error("Invalid API response: 'resources' is not an array");
        }

        const entries: ImageEntry[] = data.resources.map((r) => {
          const metadata = parseImageFilename(r.filename);
          return {
            ...metadata,
            filename: r.filename,
            year,
            url: r.url, // API already provides full URL
          };
        });

        if (!cancelled) {
          setImageEntries(filter ? entries.filter(filter) : entries);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Unknown error");
          setImageEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      cancelled = true; // avoid state updates after unmount
    };
  }, [year, filter]);

  console.log(`Image entries for year ${year}:`, imageEntries);

  return { imageEntries, loading, error };
}
