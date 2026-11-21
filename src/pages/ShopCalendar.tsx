import { useState } from "react";
import { useTranslation } from "react-i18next";
import { calendarProduct, artistContact } from "../data/shopCalendar";

export default function ShopCalendar() {
  const { t } = useTranslation();

  const title = t("shop.calendar.title");

  // All selectable images: cover first (alt = title), then previews (own alt).
  const gallery = [
    { src: calendarProduct.coverImage, alt: title },
    ...calendarProduct.previewImages.map((p) => ({ src: p.src, alt: t(p.altKey) })),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex];
  const details = t("shop.calendar.details", { returnObjects: true }) as string[];
  const description = t("shop.calendar.description", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      {/* Top: image gallery + product summary */}
      <div className="flex flex-col lg:flex-row lg:gap-12">
        {/* Gallery — thumbnails left of the cover on desktop, below it on mobile */}
        <div className="lg:w-1/2 flex flex-col-reverse sm:flex-row gap-3">
          {gallery.length > 1 && (
            <div className="flex sm:flex-col gap-3 justify-center sm:justify-start">
              {gallery.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActiveIndex(i)}
                  className={`border transition ${
                    activeIndex === i
                      ? "border-black"
                      : "border-transparent hover:border-gray-400"
                  }`}
                  aria-label={img.alt}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-16 h-16 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main / selected image */}
          <div className="flex-1 flex items-start justify-center">
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="w-full max-w-md h-auto object-contain shadow-md"
            />
          </div>
        </div>

        {/* Product summary */}
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
          <p className="font-serif italic text-lg md:text-xl text-gray-600 mt-2">
            {t("shop.calendar.subtitle")}
          </p>
          <p className="text-gray-700 leading-relaxed mt-6 max-w-prose">
            {t("shop.calendar.intro")}
          </p>

          <p className="font-serif text-2xl mt-8">{calendarProduct.price}</p>

          {/* Buy button → Stripe payment link (new tab) */}
          <a
            href={calendarProduct.stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full sm:inline-block sm:w-auto text-center px-10 py-3 text-base bg-black text-white hover:bg-gray-800 transition"
          >
            {t("shop.calendar.buyNow")}
          </a>
        </div>
      </div>

      {/* Product details */}
      <div className="mt-16 max-w-2xl">
        <h2 className="font-serif text-xl mb-3">
          {t("shop.calendar.detailsHeading")}
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Description — artist photo + signature + contact on the left, text on the right */}
      <div className="mt-16 flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="md:w-1/3 shrink-0">
          <img
            src={calendarProduct.artistPhoto}
            alt={t("shop.calendar.artistPhotoAlt")}
            className="w-full h-auto object-cover shadow-md"
            loading="lazy"
          />
          <img
            src={calendarProduct.signatureImage}
            alt={t("shop.calendar.signatureAlt")}
            className="mt-4 w-48 max-w-full h-auto"
            loading="lazy"
          />
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            <li>
              {t("shop.calendar.contactLabels.website")}:{" "}
              <a
                href={artistContact.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                {artistContact.website}
              </a>
            </li>
            <li>
              {t("shop.calendar.contactLabels.instagram")}:{" "}
              <a
                href={artistContact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >
                {artistContact.instagram}
              </a>
            </li>
            <li>
              {t("shop.calendar.contactLabels.email")}:{" "}
              <a
                href={`mailto:${artistContact.email}`}
                className="underline hover:text-black"
              >
                {artistContact.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:w-2/3">
          <h2 className="font-serif text-xl mb-3">
            {t("shop.calendar.descriptionHeading")}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {description.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
