import { useState } from "react";
import { useGalleryImages, type ImageEntry } from "../hooks/useGalleryImages";
import TabSelector from "../components/TabSelector";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

const years = ["2025", "2024", "2023"];

// Paintings priced above this (USD) hide their price and show
// "price on request" instead, routing the inquiry to the contact form.
const PRICE_ON_REQUEST_THRESHOLD = 2000;

export default function ShopOriginals() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const { t } = useTranslation();

  // ✅ Hook returns { imageEntries, loading, error }
  const { imageEntries: imagesForSale, loading, error } = useGalleryImages(
    selectedYear,
    (img) => parseFloat(img.price) > 0
  );

  const navigate = useNavigate();

  const handleBuyInterest = (img: ImageEntry, onRequest: boolean) => {
    navigate("/contact", {
      state: {
        subject: onRequest
          ? t("sales.inquirySubject", { title: img.title })
          : t("sales.interestSubject", { title: img.title, price: img.price }),
        image: img.url,
      },
    });
  };

  if (loading) {
    return <p className="p-6">{t("sales.loading")}</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{t("sales.error", { message: error })}</p>;
  }

  return (
    <div className="px-6 py-0">
      <TabSelector
        tabs={years}
        selectedTab={selectedYear}
        onSelect={setSelectedYear}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imagesForSale.map((img) => {
          const onRequest = parseFloat(img.price) > PRICE_ON_REQUEST_THRESHOLD;
          return (
            <div key={img.filename} className="group transition-all text-center">
              <Link to={`/gallery/${img.year}/${img.filename}?show-price=true`}>
                <img
                  src={img.thumbnailUrl} // ✅ Thumbnail by default
                  alt={img.title}
                  className="w-full h-auto object-cover group-hover:opacity-80 transition"
                  loading="lazy"
                  onMouseEnter={(e) => (e.currentTarget.src = img.url)} // ✅ Swap to full on hover
                  onMouseLeave={(e) => (e.currentTarget.src = img.thumbnailUrl)}
                />
              </Link>
              <p className="mt-2 text-sm font-semibold">{img.title}</p>
              <p className="text-sm text-gray-600">
                {onRequest ? t("sales.priceOnRequest") : `$${img.price}`}
              </p>
              <button
                className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
                onClick={() => handleBuyInterest(img, onRequest)}
              >
                <ShoppingCart className="w-4 h-4" />
                {onRequest ? t("sales.inquire") : t("sales.interested")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
