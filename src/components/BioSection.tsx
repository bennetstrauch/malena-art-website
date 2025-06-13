// src/components/about/BioSection.tsx
import React from "react";

interface BioSectionProps {
  imageSrc: string;
  imageAlt: string;
  text: string;
  imageLeft?: boolean;
}

const BioSection: React.FC<BioSectionProps> = ({ imageSrc, imageAlt, text, imageLeft = true }) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        imageLeft ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-6 md:gap-12 my-8`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow"
      />
      <p className="text-base md:text-lg leading-relaxed md:w-1/2 whitespace-pre-line">{text}</p>
    </div>
  );
};

export default BioSection;
