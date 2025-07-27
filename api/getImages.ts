import { VercelRequest, VercelResponse } from '@vercel/node';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const year = req.query.year as string;
  if (!year) return res.status(400).json({ error: 'Missing year' });

  try {
    const result = await cloudinary.v2.search
      .expression(`folder:your_folder/${year}`)
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    const filenames = result.resources.map((r) => r.filename || r.public_id);
    res.status(200).json(filenames);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch images', details: e });
  }
}
