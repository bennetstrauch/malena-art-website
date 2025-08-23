import React from "react";
import { Link } from "react-router-dom";

interface LandingPaintingProps {
  image: string;
  title: string;
  to: string;
  style?: React.CSSProperties;
  isMobilePortrait?: boolean;
  width?: string; // e.g. "20vw"
  onImageLoad?: () => void; // notify parent when image finished loading
}

const LandingPainting = React.forwardRef<HTMLDivElement, LandingPaintingProps>(
  ({ image, title, to, style, isMobilePortrait = false, width = "20vw", onImageLoad }, ref) => {
    return (
      <Link to={to} className="absolute" style={style}>
        <div
          ref={ref}
          className="flex flex-col items-end group cursor-pointer"
          style={{
            width,
            minWidth: "15vw",
            maxWidth: "28vw",
            fontSize: "2.4vw",
          }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover shadow-md group-hover:scale-105 transition-transform"
            draggable={false}
            onLoad={() => onImageLoad && onImageLoad()}
          />
          <span
            className="mt-1 text-gray-700 group-hover:text-blue-600 text-right mr-2"
            style={isMobilePortrait ? { fontSize: "3vh" } : {}}
          >
            {title}
          </span>
        </div>
      </Link>
    );
  }
);

LandingPainting.displayName = "LandingPainting";
export default LandingPainting;
