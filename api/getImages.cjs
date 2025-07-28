// api/getImages.cjs
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const year = req.query.year;
  if (!year) {
    return res.status(400).json({ error: 'Missing year' });
  }

  try {
    const result = await cloudinary.search
      .expression(`public_id.starts_with:malena-site/gallery/${year}/`)
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

      console.log('Cloudinary search result:', result);

    
    res.status(200).json(result.resources);
  } catch (e) {
    console.error("Cloudinary Function Error:", e);
    res.status(500).json({ error: 'Failed to fetch images', details: e.message });
  }
};