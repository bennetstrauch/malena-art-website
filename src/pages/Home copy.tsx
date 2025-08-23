import { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";

function Home() {
  const artistRef = useRef<HTMLImageElement | null>(null);

  // refs to each LandingPainting's outer <div>
  const paintingRefs = useRef<(HTMLDivElement | null)[]>([]);

  // anchor (artist top / artist right x)
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  // viewport portrait mobile flag
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  // measured size (px) of a painting (we measure the first painting after its image loads)
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);

  // small mobile nudge (left / up)
  const MOBILE_NUDGE = { x: -55, y: -50 }; // px, tweak to taste

  // update artist anchor + portrait flag
  useEffect(() => {
    function updatePosition() {
      if (artistRef.current) {
        const rect = artistRef.current.getBoundingClientRect();
        setAnchor({ top: rect.top, right: rect.left + rect.width });
      }
      const portrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(portrait);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    // also update on orientationchange for some mobile browsers
    window.addEventListener("orientationchange", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, []);

  // painting size as CSS width string (passed to LandingPainting)
  const paintingSize = isMobilePortrait ? "28vw" : "15vw";

  // called from LandingPainting when its <img> finishes loading
  const handlePaintingImageLoad = (index: number) => {
    // measure the first painting (index 0) to compute proportional gaps
    const el = paintingRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    // store measured px width and height
    setMeasured({ width: r.width, height: r.height });
  };

  // helper to compute style for each painting using measured dims (with sensible fallbacks)
  const getStyles = (paintingIndex: number) => {
    const measuredHeight = measured?.height ?? 200; // fallback px
    const measuredWidth = measured?.width ?? 150; // fallback px

    if (isMobilePortrait) {
      // Stack vertically below the first painting.
      // Use measuredHeight to compute vertical spacing so it scales
      const topBase = anchor.top;
      const leftBase = anchor.right + 15 + MOBILE_NUDGE.x; // nudged a bit left
      const topNudge = MOBILE_NUDGE.y;

      // spacing multipliers (tweak if you want tighter/looser stacks)
      const spacingMultiplier = 1.3; // little overlap allowance so it looks like a natural column
      if (paintingIndex === 0) {
        return {
          top: `${topBase + topNudge}px`,
          left: `${leftBase}px`,
        };
      }
      // i === 1
      if (paintingIndex === 1) {
        return {
          top: `${topBase + measuredHeight * spacingMultiplier + topNudge}px`,
          left: `${leftBase}px`,
        };
      }
      // i === 2
      return {
        top: `${topBase + measuredHeight * spacingMultiplier * 2 + topNudge}px`,
        left: `${leftBase}px`,
      };
    } else {
      // Desktop / landscape — diagonal stagger relative to anchor + measured size
      // Tuned multipliers for pleasing stagger (first at brush tip, second lower-right, third higher-right)
      const baseTop = anchor.top - 35;
      const baseLeft = anchor.right - 15;
      const spacingMultiplier = 1.9; // tweak to taste for horizontal spacing

      if (paintingIndex === 0) {
        return {
          top: `${baseTop - measuredHeight * 0.05}px`, // slight lift so it aligns with brush tip visually
          left: `${baseLeft}px`,
        };
      }
      if (paintingIndex === 1) {
        return {
          top: `${baseTop + measuredHeight * 0.65}px`,
          left: `${baseLeft * spacingMultiplier + measuredWidth * 0.6}px`,
        };
      }
      // i === 2
      return {
        top: `${baseTop + measuredHeight * 0.15}px`,
        left: `${baseLeft * spacingMultiplier * 1.5 + measuredWidth * 1.15}px`,
      };
    }
  };

  const paintings = [
    { image: "/images/painting1.jpg", title: "Gallery", to: "/gallery" },
    { image: "/images/painting2.jpg", title: "Contact", to: "/contact" },
    { image: "/images/painting3.jpg", title: "About", to: "/about" },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Background Wall */}
      <img
        src="/images/extra-long-wall-short-floor.jpg"
        alt="Gallery Wall"
        className="absolute bottom-0 left-0 z-0 pointer-events-none"
        style={{ height: "100%", width: "auto", objectFit: "cover", objectPosition: "left bottom" }}
      />

      {/* Paintings container */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto">
        {paintings.map((p, index) => (
          <LandingPainting
            // assign a function ref that returns void (block body), so TS accepts it
            ref={(el: HTMLDivElement | null) => {
              paintingRefs.current[index] = el;
            }}
            key={p.title}
            image={p.image}
            title={p.title}
            to={p.to}
            isMobilePortrait={isMobilePortrait}
            width={paintingSize}
            onImageLoad={() => handlePaintingImageLoad(index)}
            style={{
              position: "absolute",
              width: paintingSize,
              // merge computed style: top/left or top/right depending on computed object
              ...getStyles(index),
            }}
          />
        ))}
      </div>

      {/* Foreground Artist */}
      <img
        ref={artistRef}
        src="/images/artist_extracted.png"
        alt="Malena painting"
        className="absolute bottom-1 left-0 h-full z-20 pointer-events-none"
        style={{ objectFit: "contain", maxHeight: "85vh" }}
      />
    </div>
  );
}

export default Home;
