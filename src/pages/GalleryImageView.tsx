import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";
import { loadYearEntries, toProtectedUrl, type YearEntry } from "../utility/galleryApi";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import HamburgerMenu from "../components/HamburgerMenuImageView";
import { useTranslation } from "react-i18next";

export default function GalleryImageView() {
  const { year, filename } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const showPrice = searchParams.get("show-price") === "true";
  const navigate = useNavigate();
  const [entries, setEntries] = useState<YearEntry[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [imageData, setImageData] = useState<{
    url: string;
    title: string;
    year: string;
    material: string;
    size: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    if (!year) return;
    loadYearEntries(year).then(setEntries);
  }, [year]);

  useEffect(() => {
    if (entries.length && filename) {
      setIndex(entries.findIndex(e => e.filename === filename));
    }
  }, [entries, filename]);

  useEffect(() => {
    if (index >= 0 && entries[index]) {
      const { filename, url } = entries[index];
      setImageData({ ...parseImageFilename(filename), url });
    }
  }, [index, entries]);

  const goNext = () => index < entries.length - 1 && setIndex(index + 1);
  const goPrev = () => index > 0 && setIndex(index - 1);

  if (!imageData) return <div>{t("galleryView.loading")}</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-black hover:text-gray-600"
      >
        <ArrowLeft size={32} />
      </button>

      <HamburgerMenu />

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

      {/* Image with download protection */}
      <div className="relative select-none">
        <img
          src={toProtectedUrl(imageData.url)}
          alt={imageData.title}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          className="max-w-full max-h-[80vh] object-contain mb-4"
        />
        {/* Transparent overlay blocks drag and right-click */}
        <div
          className="absolute inset-0"
          onContextMenu={e => e.preventDefault()}
        />
      </div>

      <div className="text-center">
        <p className="italic text-lg">{imageData.title}</p>
        <p className="text-sm">
          {imageData.year}, {imageData.material}, {imageData.size}"
          {showPrice && (parseFloat(imageData.price) > 0 ? `, $${imageData.price}` : "")}
        </p>
      </div>
    </div>
  );
}
