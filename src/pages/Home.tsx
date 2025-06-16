import { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";
// not dynamic # what are hooks?
export const isMobile = window.innerWidth <= 420;

function Home() {

   const paintingRef = useRef<HTMLImageElement>(null);
  const [topRight, setTopRight] = useState<{ top: number; right: number }>({top: 0, right: 155});

  useEffect(() => {
    if (paintingRef.current) {
      const rect = paintingRef.current.getBoundingClientRect();
      setTopRight({ top: rect.top, right: rect.left + rect.width });
      console.log("Top-Right Coordinates:", rect.top, rect.left + rect.width);
    }
  }, []);


  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Background Wall - Scales exactly to viewport height */}
      <img
        src="/images/extra-long-wall-short-floor.jpg"
        alt="Gallery Wall"
        className="absolute bottom-0 left-0 z-0 pointer-events-none"
        style={{
          height: "100%", // Always fill vertical space
          width: "auto", // Let width scale naturally
          objectFit: "cover", // ✅ Crop horizontally if needed
          objectPosition: "left bottom", // ✅ Keep floor visible, cut from right
        }}
      />

       
      {/* Paintings */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto">
        <LandingPainting
          image="/images/painting1.jpg"
          title="Gallery"
          to="/gallery"
          style={{ top: isMobile ? "1%" : "5%", left: `${topRight.right-15}px`, }}
        />
        <LandingPainting
          image="/images/painting2.jpg"
          title="Contact"
          to="/contact"
          style={ isMobile
            ? { top: "34%", left: "165px" }
            : { top: "40%", right: "38%"}}
        />
        <LandingPainting
          image="/images/painting3.jpg"
          title="About"
          to="/about"
          style={ isMobile
            ? { bottom: "8%", left: "175px" }
            : { top: "12%", right: "10%" }}
        />
      </div>

      {/* Foreground Artist (click-through) */}
      <img
        ref={paintingRef}
        src="/images/artist_extracted.png"
        alt="Malena painting"
        className="absolute bottom-1 left-0 h-full z-20 pointer-events-none"
        style={{ objectFit: "contain", maxHeight: "85vh" }}
      />
    </div>
  );
}

export default Home;
