import { useEffect, useState, useRef } from "react";
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
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;

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
          const thumbUrl = r.url.replace(
            "/upload/",
            "/upload/w_300,h_300,c_fill/"
          );
          return {
            ...metadata,
            filename: r.filename,
            year,
            url: r.url,
            thumbnailUrl: thumbUrl,
          };
        });

        // ## fix sales

        // Apply filter if provided
        // const filteredEntries = filter ? entries.filter(filter) : entries;

        if (!cancelRef.current) {
          // Avoid setting state if data did not change (simple JSON compare)
          if (!cancelRef.current) {
            setImageEntries(filter ? entries.filter(filter) : entries);
          }
        }
      } catch (err: any) {
        if (!cancelRef.current) {
          setError(err.message || "Unknown error");
          setImageEntries([]);
        }
      } finally {
        if (!cancelRef.current) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      cancelRef.current = true;
    };
  }, [year]);

  return { imageEntries, loading, error };
}
