import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";

// const allImages = import.meta.glob("/public/images/gallery/*/*.jpg", {
//   as: "url",
// });

export type ImageEntry = {
  title: string;
  year: string;
  material: string;
  size: string;
  price: string;
  filename: string;
  url: string;
};

const BASE_URL = "https://malenastrauch.vercel.app"; // or preview URL

export function useGalleryImages(
  year: string,
  filter?: (img: ImageEntry) => boolean
) {
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

 useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/getImages?year=${year}`);
        const filenames: string[] = await res.json();

        const entries: ImageEntry[] = filenames.map((filename) => {
          const metadata = parseImageFilename(filename);
          return {
            ...metadata,
            filename,
            year,
            url: `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_BASE_URL}/image/upload/malena-site/gallery/${year}/${filename}.jpg`,
          };
        });

        setImageEntries(filter ? entries.filter(filter) : entries);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, [year, filter]);

  console.log(`Image entries for year ${year}:`, imageEntries);

  return imageEntries;
}
