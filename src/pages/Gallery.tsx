import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";

const years = ["2025", "2024", "2023"];

type ImageEntry = {
  title: string;
  year: string;
  material: string;
  size: string;
  price: string;
  filename: string;
  url: string;
};

const allImages = import.meta.glob('/public/images/*/*.jpg', { as: 'url' });

export default function Gallery() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const filtered = await Promise.all(
        Object.entries(allImages)
          .filter(([path]) => path.includes(`/${selectedYear}/`))
          .map(async ([path, importer]) => {
            const url = await importer();
            const filename = path.split("/").pop()!;
            return {
              ...parseImageFilename(filename),
              url,
            };
          })
      );

      setImageEntries(filtered);
    };

    loadImages();
  }, [selectedYear]);

  return (
    <div className="px-6 py-12">
      <div className="flex justify-center gap-4 mb-8 text-lg">
        {years.map((year) => (
          <button
            key={year}
            className={`px-3 py-1 ${
              selectedYear === year ? "font-bold underline" : ""
            }`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imageEntries.map((img) => (
          <div
            key={img.filename}
            className="cursor-pointer text-center group transition-all"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-auto object-cover group-hover:opacity-80"
            />
            <p className="mt-2 text-sm">{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
