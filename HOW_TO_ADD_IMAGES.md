# How to Add New Paintings to the Website

## The short version

1. Upload the image to Cloudinary with the correct filename
2. Push to `main` on GitHub
3. Done — the website updates automatically within a minute or two

---

## Step 1 — Name the file correctly

The filename is how the website knows the title, year, material, size, and price of each painting. There is no separate database.

**Format:**
```
Title_Year_Material_Dimensions_Price.jpg
```

**Rules:**
- Use `+` instead of spaces (e.g. `Forest Light` → `Forest+Light`)
- Separate the five fields with `_` (underscore)
- Dimensions: width × height in inches, written as `24x30`
- Price: number in USD with no currency symbol. Use `0` if not for sale.

**Examples:**
```
Forest+Light_2025_Acrylic+on+Canvas_24x30_1200.jpg
Blue+Horizon_2024_Oil+on+Canvas_36x48_0.jpg
Echoes+of+Space+&+Time_2025_Acrylic+on+Canvas_48x40_4000.jpg
```

---

## Step 2 — Upload to Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and log in
2. Navigate to **Media Library**
3. Go to the folder: `malena-site/gallery/` → then the correct **year folder** (e.g. `2025`)
   - If the year folder doesn't exist yet, create it
4. Upload your image file with the correctly formatted filename from Step 1

That's it for Cloudinary.

---

## Step 3 — Push to GitHub

The website won't update until you push a change to the `main` branch on GitHub. The push triggers an automatic rebuild and deployment.

If you only added images to Cloudinary (no code changes), you can make a tiny change to trigger the build — for example, open `CLAUDE.md` and add a space, then commit and push.

Or if you're using Claude Code, just ask it to make the commit and push.

**What happens after you push:**
1. GitHub Actions runs automatically (takes ~1-2 minutes)
2. The site rebuilds and fetches the new image list from Cloudinary
3. CloudFront cache is cleared
4. Your new paintings appear on the website

---

## Where do paintings show up?

- **Gallery page** (`/gallery`) — all paintings, sorted by year tab
- **Sales page** (`/sales`) — only paintings with price > 0

---

## Changing the 3 home page paintings

The paintings on the landing page are **separate** from the gallery — they are fixed image files, not from Cloudinary.

To change them, replace these files (keep the same filenames):
```
public/images/painting1.jpg   ← left painting (links to Gallery)
public/images/painting2.jpg   ← middle painting (links to Contact)
public/images/painting3.jpg   ← right painting (links to About)
```

Then commit and push to `main`.

---

## Troubleshooting

**My painting shows up in Cloudinary but not on the website**
- Make sure the image is in the correct folder: `malena-site/gallery/2025/` (or the right year)
- Check the filename format — even one wrong character will break parsing
- Make sure you pushed to `main` to trigger a new build

**The price/title/material shows wrong**
- The filename is the source of truth — fix the filename in Cloudinary and push again
