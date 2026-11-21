// Static product config for the 2027 Art Calendar.
// Not a Cloudinary gallery painting — there is exactly one calendar and it
// rarely changes, so its metadata lives here in code.
//
// TODO: swap the dummy images below for the real calendar cover + preview shots
// (drop the files in public/images/ and update the paths).

/** A preview thumbnail: image file + i18n key for its alt text */
export type CalendarImage = {
  src: string;
  altKey: string;
};

export type CalendarProduct = {
  /** Display price, incl. currency symbol — same in every language (e.g. "€29.90") */
  price: string;
  /** Stripe Payment Link — opened in a new tab by the "Buy now" button */
  stripeUrl: string;
  /** Front/cover image shown large on the detail page (alt = calendar title) */
  coverImage: string;
  /** Additional preview images the visitor can click through (artwork first, product shots after) */
  previewImages: CalendarImage[];
  /** Portrait of the artist shown beside the Description */
  artistPhoto: string;
  /** Handwritten signature (line art, PNG) shown under the artist photo */
  signatureImage: string;
};

export const calendarProduct: CalendarProduct = {
  price: "€29.90",
  stripeUrl: "https://buy.stripe.com/cNieVcfQ221zeQ1eDNbAs00",
  coverImage: "/images/calendar-cover.jpg",
  previewImages: [
    { src: "/images/calendar-january.jpg", altKey: "shop.calendar.previewAlt.january" },
    { src: "/images/calendar-october.jpg", altKey: "shop.calendar.previewAlt.october" },
    { src: "/images/calendar-fan.jpg", altKey: "shop.calendar.previewAlt.fan" },
    { src: "/images/calendar-overview.jpg", altKey: "shop.calendar.previewAlt.overview" },
  ],
  artistPhoto: "/images/calendar-artist.jpg",
  signatureImage: "/images/calendar-signature.png",
};

/** Public contact details shown under the artist photo (values are not translated). */
export const artistContact = {
  website: "malenastrauch.com",
  websiteUrl: "https://malenastrauch.com",
  instagram: "@malenastrauch",
  instagramUrl: "https://www.instagram.com/malenastrauch",
  email: "strauchmalena@gmail.com",
};
