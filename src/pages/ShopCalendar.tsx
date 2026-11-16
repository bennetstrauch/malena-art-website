import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { calendarProduct } from "../data/shopCalendar";

export default function ShopCalendar() {
  const { t } = useTranslation();

  // All selectable images: cover first, then previews.
  const images = [calendarProduct.coverImage, ...calendarProduct.previewImages];
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto flex flex-col items-center">
      <h1 className="font-serif text-3xl md:text-4xl mb-6 text-center">
        {t(calendarProduct.titleKey)}
      </h1>

      {/* Main / selected image */}
      <img
        src={activeImage}
        alt={t(calendarProduct.titleKey)}
        className="w-full max-w-md h-auto object-contain shadow-md"
      />

      {/* Thumbnail strip (cover + previews) */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImage(img)}
              className={`border-2 transition ${
                activeImage === img ? "border-black" : "border-transparent hover:border-gray-400"
              }`}
              aria-label={`${t(calendarProduct.titleKey)} ${i + 1}`}
            >
              <img
                src={img}
                alt=""
                className="w-20 h-20 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Buy button → Stripe payment link (new tab) */}
      <a
        href={calendarProduct.stripeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-base bg-black text-white rounded hover:bg-gray-800 transition"
      >
        <ShoppingCart className="w-5 h-5" />
        {t("shop.buyCalendar")}
      </a>
    </div>
  );
}
