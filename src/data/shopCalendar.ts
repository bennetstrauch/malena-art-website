// Static product config for the 2027 Art Calendar.
// Not a Cloudinary gallery painting — there is exactly one calendar and it
// rarely changes, so its metadata lives here in code.
//
// TODO: swap the dummy images below for the real calendar cover + preview shots
// (drop the files in public/images/ and update the paths).

export type CalendarProduct = {
  /** i18n key for the display title */
  titleKey: string;
  /** Stripe Payment Link — opened in a new tab by the "Buy Calendar" button */
  stripeUrl: string;
  /** Front/cover image shown large on the detail page */
  coverImage: string;
  /** 1–2 additional preview images the visitor can click through */
  previewImages: string[];
};

export const calendarProduct: CalendarProduct = {
  titleKey: "shop.calendarTitle",
  stripeUrl: "https://buy.stripe.com/cNieVcfQ221zeQ1eDNbAs00",
  // --- dummy placeholders for now ---
  coverImage: "/images/painting3.jpg",
  previewImages: ["/images/painting1.jpg", "/images/painting2.jpg"],
};
