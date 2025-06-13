// src/pages/GalleryImageView.tsx
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import HamburgerMenu from "../components/HamburgerMenuImageView";

const allImages = import.meta.glob("/public/images/gallery/*/*.jpg", {
  as: "url",
});

// ##instead of arrows use swipe at phone

export default function GalleryImageView() {
  const { year, filename } = useParams();
  const [searchParams] = useSearchParams();
  const showPrice = searchParams.get("show-price") === "true";
  const navigate = useNavigate();
  const [entries, setEntries] = useState<{ filename: string; url: string }[]>(
    []
  );
  const [index, setIndex] = useState<number>(-1);
  const [imageData, setImageData] = useState<{
    url: string;
    title: string;
    year: string;
    material: string;
    size: string;
    price: string;
  } | null>(null);

  // Load all image entries for current year
  useEffect(() => {
    const load = async () => {
      const list = await Promise.all(
        Object.entries(allImages)
          .filter(([path]) => path.includes(`/${year}/`))
          .map(async ([path, importer]) => ({
            filename: path.split("/").pop()!,
            url: await importer(),
          }))
      );
      list.sort((a, b) => a.filename.localeCompare(b.filename));
      setEntries(list);
    };
    load();
  }, [year]);

  // Once entries loaded, find the index
  useEffect(() => {
    if (entries.length && filename) {
      const i = entries.findIndex((e) => e.filename === filename);
      setIndex(i);
    }
  }, [entries, filename]);

  // Load selected image data
  useEffect(() => {
    if (index >= 0 && entries[index]) {
      const { filename, url } = entries[index];
      const parsed = parseImageFilename(filename);
      setImageData({ ...parsed, url });
    }
  }, [index, entries]);

  const goNext = () => index < entries.length - 1 && setIndex(index + 1);
  const goPrev = () => index > 0 && setIndex(index - 1);

  if (!imageData) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4 flex flex-col items-center">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-black hover:text-gray-600"
      >
        <ArrowLeft size={32} />
      </button>

      {/* Hamburger menu */}
      <HamburgerMenu />

      {/* Navigation Arrows */}
      {index > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-black hover:text-gray-600"
        >
          <ChevronLeft size={48} />
        </button>
      )}
      {index < entries.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-gray-600"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image */}
      <img
        src={imageData.url}
        alt={imageData.title}
        className="max-w-full max-h-[80vh] object-contain mb-4"
      />

      {/* Details */}
      <div className="text-center">
        <p className="italic text-lg">{imageData.title}</p>
        <p className="text-sm">
          {imageData.year}, {imageData.material}, {imageData.size}"
          { showPrice && (parseFloat(imageData.price) > 0 ? `, $${imageData.price}` : "")}
        </p>
      </div>
    </div>
  );
}
