import { useEffect, useState, useRef } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";
import { loadYearEntries, toThumbnailUrl } from "../utility/galleryApi";

export type ImageEntry = {
  title: string;
  year: string;
  material: string;
  size: string;
  price: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
};

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
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const raw = await loadYearEntries(year);

        if (cancelRef.current) return;

        const entries: ImageEntry[] = raw.map(r => ({
          ...parseImageFilename(r.filename),
          filename: r.filename,
          year,
          url: r.url,
          thumbnailUrl: toThumbnailUrl(r.url),
        }));

        setImageEntries(filter ? entries.filter(filter) : entries);
      } catch (err: unknown) {
        if (!cancelRef.current) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setImageEntries([]);
        }
      } finally {
        if (!cancelRef.current) setLoading(false);
      }
    };

    load();
    return () => { cancelRef.current = true; };
  }, [year]);

  return { imageEntries, loading, error };
}
