// src/hooks/useGalleryImages.ts
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

export function useGalleryImages(year: string, filter?: (img: ImageEntry) => boolean) {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        Object.entries(allImages)
          .filter(([path]) => path.includes(`/${year}/`))
          .map(async ([path, importer]) => {
            const url = await importer();
            const filename = path.split("/").pop()!;
            const parsed = { ...parseImageFilename(filename), url };
            return parsed;
          })
      );

      const filtered = filter ? images.filter(filter) : images;
      setImageEntries(filtered);
    };

    loadImages();
  }, [year, filter]);

  return imageEntries;
}
