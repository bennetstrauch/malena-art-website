# Malena Strauch – Artist Portfolio Website

A portfolio website for visual artist Malena Strauch. Built with React + TypeScript, hosted on AWS (S3 + CloudFront), with images managed via Cloudinary.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Routing:** React Router v7
- **Images:** Cloudinary (gallery images) + static imports (about page images in `src/assets/web/`)
- **Contact form:** EmailJS
- **Hosting:** AWS S3 + CloudFront CDN
- **API:** Vercel serverless functions (`/api/getImages.cjs`)
- **CI/CD:** GitHub Actions — auto-deploys on push to `main`

## Deployment

**Pushing to `main` automatically deploys the site.**

GitHub Actions (`.github/workflows/deploy.yml`) runs on every push to `main`:
1. Installs dependencies
2. Runs `npm run build` (which first calls `prebuild` → generates Cloudinary manifest)
3. Syncs the `dist/` folder to S3 bucket `malena-website-frontend`
4. Invalidates the CloudFront cache so changes are live immediately

Required GitHub Secrets: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `AWS_ACCESS_KEY_ID`, `CLOUDINARY_API_KEY`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `CLOUDFRONT_DISTRIBUTION_ID`.

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/Home.tsx` | Landing page with artist image + 3 painting links |
| `/gallery` | `src/pages/Gallery.tsx` | Year-tabbed grid of all paintings |
| `/gallery/:year/:filename` | `src/pages/GalleryImageView.tsx` | Full-screen single painting view |
| `/sales` | `src/pages/Sales.tsx` | Paintings for sale (price > 0 only) |
| `/contact` | `src/pages/Contact.tsx` | Contact form via EmailJS |
| `/about` | `src/pages/About.tsx` | Bio + Artist Statement tabs |

## Adding New Images

See `HOW_TO_ADD_IMAGES.md` for the full step-by-step guide.

**Short version:** Upload to Cloudinary under `malena-site/gallery/{year}/` using the exact filename format:
```
Title_YYYY_Material_Dimensions_Price.jpg
```
Example: `Forest+Light_2025_Acrylic+on+Canvas_24x30_1200.jpg`

Then push to `main` — the site rebuilds and picks up the new images automatically.

## Image Filename Format

The filename encodes all painting metadata (no separate database needed):

```
Title_Year_Material_Dimensions_Price.jpg
```

- Use `+` for spaces within a field (e.g. `Acrylic+on+Canvas`)
- Use `&` for "and" (e.g. `Acrylic+&+Oil`)
- Dimensions: `WidthxHeight` in inches (e.g. `24x30`)
- Price: number in USD, use `0` if not for sale

Parsed by `src/utility/ParserImageFilename.ts`.

## Static / Home Page Images

The 3 paintings on the home page are **not** from Cloudinary — they are static files:
- `public/images/painting1.jpg` → links to Gallery
- `public/images/painting2.jpg` → links to Contact
- `public/images/painting3.jpg` → links to About

To swap them, just replace those files and push.

## About Page Images

About page images are static imports stored in `src/assets/web/`. To update them, replace the files and update the imports in `src/pages/About.tsx`.

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env` file with Cloudinary credentials (see `.env.example` if present, or ask).

## Key Files

| File | Purpose |
|------|---------|
| `api/getImages.cjs` | Serverless endpoint — fetches images from Cloudinary by year |
| `scripts/generate-manifest.mjs` | Build-time script — pre-fetches image list into manifest |
| `src/hooks/useGalleryImages.ts` | React hook — fetches/caches gallery images |
| `src/utility/ParserImageFilename.ts` | Parses filename into title/year/material/size/price |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
| `vercel.json` | Vercel config for serverless API routes |
