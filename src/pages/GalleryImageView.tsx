// src/pages/GalleryImageView.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { parseImageFilename } from "../utility/ParserImageFilename";
import { ArrowLeft } from "lucide-react";

const allImages = import.meta.glob("/public/images/gallery/*/*.jpg", {
  as: "url",
});

export default function GalleryImageView() {
  const { year, filename } = useParams();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<{
    url: string;
    title: string;
    year: string;
    material: string;
    size: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    const key = `/public/images/gallery/${year}/${filename}`;
    const load = async () => {
      if (allImages[key]) {
        const url = await allImages[key]();
        const parsed = parseImageFilename(filename!);
        setImageData({ ...parsed, url });
      }
    };
    load();
  }, [year, filename]);

  if (!imageData) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-black hover:text-gray-600"
      >
        <ArrowLeft size={32} />
      </button>

      <img
        src={imageData.url}
        alt={imageData.title}
        className="max-w-full max-h-[80vh] object-contain mb-4"
      />

      <div className="text-center">
        <p className="italic text-lg">{imageData.title}</p>
        <div className="text-sm">{imageData.year},  {imageData.material}, {imageData.size}"</div>
      
      </div>
    </div>
  );
}
