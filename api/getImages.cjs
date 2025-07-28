// api/getImages.cjs
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
module.exports = async (req, res) => {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/${year}`)
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    const filenames = result.resources.map(r => r.filename || r.public_id);
    res.status(200).json(filenames);
  } catch (e) {
    // Ensure CORS headers are included even in error
    res.status(500).json({
      error: 'Failed to fetch images',
      details: e.message || e.toString()
    });
  }
};
