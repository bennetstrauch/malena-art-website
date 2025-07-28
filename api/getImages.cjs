
const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const year = req.query.year;
  if (!year) return res.status(400).json({ error: 'Missing year' });

  try {
    const result = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/${year}`)
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    const filenames = result.resources.map((r) => r.filename || r.public_id);
    res.status(200).json(filenames);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch images', details: e });
  }
};
