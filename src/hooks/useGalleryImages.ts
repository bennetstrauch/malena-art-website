import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";

const allImages = import.meta.glob("/public/images/gallery/*/*.jpg", {
  as: "url",
});

export type ImageEntry = {
  title: string;
  year: string;
  material: string;
  size: string;
  price: string;
  filename: string;
  url: string;
};

export function useGalleryImages(
  year: string,
  filter?: (img: ImageEntry) => boolean
) {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const matchingFiles = Object.entries(allImages).filter(([path]) =>
        path.includes(`/${year}/`)
      );

      const entries: ImageEntry[] = [];

      for (const [path, importer] of matchingFiles) {
        try {
          const url = await importer();
          const filename = path.split("/").pop()!;
          const metadata = parseImageFilename(filename);
          entries.push({ ...metadata, filename, url });
        } catch (error) {
          console.error(`Error parsing image "${path}":`, error);
        }
      }

      setImageEntries(filter ? entries.filter(filter) : entries);
    };

    loadImages();
  }, [year, filter]);

  return imageEntries;
}
