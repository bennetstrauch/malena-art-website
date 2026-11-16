import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { calendarProduct } from "../data/shopCalendar";

// Full-width banner card used for each shop category (see categoryDraftShop).
function CategoryBanner({
  to,
  image,
  label,
}: {
  to: string;
  image: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group relative block w-full overflow-hidden"
      style={{ aspectRatio: "16 / 7" }}
    >
      <img
        src={image}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Darkening gradient so the white label stays legible on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10">
        <h2 className="font-serif text-3xl md:text-5xl text-white drop-shadow">
          {label}
        </h2>
        <span className="mt-2 block h-0.5 w-16 bg-white/90" />
      </div>
    </Link>
  );
}

export default function Shop() {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <h1 className="text-center font-serif text-4xl md:text-5xl mb-8">
        {t("shop.title")}
      </h1>

      <div className="flex flex-col gap-6">
        {/* 2027 Art Calendar first, then Originals (per requested order) */}
        <CategoryBanner
          to="/shop/calendar"
          image={calendarProduct.coverImage}
          label={t("shop.calendarTitle")}
        />
        <CategoryBanner
          to="/shop/originals"
          image="/images/painting1.jpg"
          label={t("shop.originalsTitle")}
        />
      </div>
    </div>
  );
}
