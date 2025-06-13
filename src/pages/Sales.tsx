// src/pages/Sales.tsx
import { useState } from "react";
import { useGalleryImages, type ImageEntry } from "../hooks/useGalleryImages";
import TabSelector from "../components/TabSelector";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const years = ["2025", "2024", "2023"];

export default function Sales() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const imagesForSale = useGalleryImages(
    selectedYear,
    (img) => parseFloat(img.price) > 0
  );
  const navigate = useNavigate();

  const handleBuyInterest = (img: ImageEntry) => {
    navigate("/contact", {
      state: {
        subject: `Interest in Buying: ${img.title}, $${img.price}`,
        // message: `I'm interested in buying the painting titled "${img.title}" from ${img.year}.`,
        image: img.url,
      },
    });
  };

  return (
    <div className="px-6 py-0">
      <TabSelector
        tabs={years}
        selectedTab={selectedYear}
        onSelect={setSelectedYear}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imagesForSale.map((img) => (
          <div key={img.filename} className="group transition-all text-center">
            <Link to={`/gallery/${img.year}/${img.filename}?show-price=true`}>
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-auto object-cover group-hover:opacity-80"
              />
            </Link>
            <p className="mt-2 text-sm font-semibold">{img.title}</p>
            <p className="text-sm text-gray-600">${img.price}</p>
            <button
              className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
              onClick={() => handleBuyInterest(img)}
            >
              <ShoppingCart className="w-4 h-4" />
              I'm Interested
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
