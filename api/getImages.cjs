// api/getImages.cjs
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const year = req.query.year;
  if (!year) return res.status(400).json({ error: 'Missing year' });

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");

  try {
    const prefix = `malena-site/gallery/${year}/`;
    let resources = [];
    let next_cursor = undefined;
    do {
      const opts = { type: 'upload', prefix, max_results: 500 };
      if (next_cursor) opts.next_cursor = next_cursor;
      const r = await cloudinary.api.resources(opts);
      console.log('cloudinary.api.resources chunk:', { returned: r.resources?.length, next_cursor: r.next_cursor, total_count: r.total_count });
      resources = resources.concat(r.resources || []);
      next_cursor = r.next_cursor;
    } while (next_cursor);

    const mapped = (resources || []).map(r => ({
      public_id: r.public_id,
      filename: r.public_id.split('/').pop(),
      url: r.secure_url,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));

    return res.status(200).json({ total: mapped.length, resources: mapped });
  } catch (e) {
    console.error("Cloudinary Function Error:", e);
    const status = e.http_code || e.statusCode || e.status || 500;
    if (status === 429) {
      return res.status(429).json({ error: 'Rate limited by Cloudinary', details: e.message || e.toString() });
    }
    return res.status(500).json({ error: 'Failed to fetch images', details: e.message || e.toString() });
  }
};
