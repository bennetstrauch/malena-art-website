import React from "react";
import { Link } from "react-router-dom";

interface LandingPaintingProps {
  image: string;
  title: string;
  to: string;
  style?: React.CSSProperties; // ✅ just React.CSSProperties
  isMobilePortrait?: boolean;
  width?: string | number;
  height?: string | number;
  onImageLoad?: () => void;
}

const LandingPainting = React.forwardRef<HTMLDivElement, LandingPaintingProps>(
  (
    { image, title, to, style, isMobilePortrait = false, width = "20vw", height = "auto", onImageLoad },
    ref
  ) => {
    console.log("Rendering LandingPainting:", title, "with width:", width, "and height:", height);
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <div
          ref={ref}
          className="flex flex-col items-end group cursor-pointer"
          style={{
            height,
            width,
            minWidth: "100px",
            // maxWidth: "260px",
            fontSize: "2.4vw",
            ...style, // ✅ allow parent to pass positioning
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
