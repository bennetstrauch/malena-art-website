//pages/gallery component
import { useEffect, useState } from "react";
import TabSelector from "../components/TabSelector";
import { Link } from "react-router-dom";
import { useGalleryImages } from "../hooks/useGalleryImages";

const years = ["2025", "2024", "2023"];

export default function Gallery() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const imageEntries = useGalleryImages(selectedYear);

  // # to restore scroll position after navigating back (extra effect needed?)
  useEffect(() => {
    const y = sessionStorage.getItem("scrollY");
    if (y) {
      window.scrollTo(0, parseInt(y));
      sessionStorage.removeItem("scrollY");
    }
  }, []);

  const handleImageClick = () => {
    sessionStorage.setItem("scrollY", window.scrollY.toString());
  };

  return (
    <div className="px-6 py-0">
      <TabSelector
        tabs={years}
        selectedTab={selectedYear}
        onSelect={setSelectedYear}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imageEntries.map((img) => (
          <div
            key={img.filename}
            className="cursor-pointer text-center group transition-all"
          >
            <Link
              to={`/gallery/${img.year}/${img.filename}`}
              onClick={handleImageClick}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-cover group-hover:opacity-80"
              />
              <p className="mt-2 text-sm">{img.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
