import { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";

function Home() {
  const artistRef = useRef<HTMLImageElement | null>(null);
  const paintingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [measured, setMeasured] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  // old-version tweakables
  const MOBILE_NUDGE = { x: -55, y: -50 }; // same as your old version
  const FLOOR_MIN_PX = 100;
  const FLOOR_VIEWPORT_FRACTION = 0.12;
  const FLOOR_MARGIN = 8;
  const isTablet =
    typeof window !== "undefined" &&
    window.innerWidth > 760 &&
    window.innerWidth <= 900;
  console.log("Viewport width:", window.innerWidth, "window: ", window);
  console.log("Is tablet:", isTablet);

  // update artist anchor + portrait flag
  useEffect(() => {
    function updatePosition() {
      if (artistRef.current) {
        const rect = artistRef.current.getBoundingClientRect();
        setAnchor({ top: rect.top, right: rect.left + rect.width });
      }

      const portrait =
        window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(portrait);
      setViewportHeight(window.innerHeight);
      console.log("Is mobile portrait:", portrait);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, []);

  // painting size as CSS width string (passed to LandingPainting)
  const paintingSize = isTablet ? "20vw" : isMobilePortrait ? "28vw" : "15vw";
  console.log("Painting size:", paintingSize);

  // measure painting size when its image loads
  const handlePaintingImageLoad = (index: number) => {
    const el = paintingRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMeasured({ width: r.width, height: r.height });
  };

  // compute floor height adaptively
  const floorHeightPx = Math.max(
    FLOOR_MIN_PX,
    viewportHeight * FLOOR_VIEWPORT_FRACTION
  );
  const floorLimitY = viewportHeight - floorHeightPx; // y coordinate (top) above which content is allowed

  const NAV_GAP_VH = 0.02; // 12% viewport height from nav
  const BOTTOM_GAP_VH = isTablet ? 0.3 : 0.22; // 10% viewport height from bottom
  const MIN_MID_GAP = 40; // px

  const computeAllPositions = () => {
    const measuredHeight = measured?.height ?? 200;
    const measuredWidth = measured?.width ?? 150;
    const results: { top: number; left: number; scale?: number }[] = [];

    if (isMobilePortrait ) {
      const viewportH = window.innerHeight;

      // horizontal stays relative to anchor
      const leftBase = anchor.right + 15 + MOBILE_NUDGE.x;

      // --- TOP image ---
      const firstTop = viewportH * NAV_GAP_VH;
      results.push({ top: firstTop, left: leftBase });

      // --- BOTTOM image ---
      const bottomLimit = viewportH - viewportH * BOTTOM_GAP_VH;
      const thirdTop = bottomLimit - measuredHeight;
      results.push({ top: 0, left: 0 }); // placeholder for middle
      results.push({ top: thirdTop, left: leftBase });

      // --- MIDDLE image ---
      const firstBottom = firstTop + measuredHeight;
      const gapBetween = thirdTop - firstBottom;
      const middleTop = firstBottom + gapBetween / 2 - measuredHeight / 2;
      console.log(
        "All values: firstTop: ",
        firstTop,
        " middleTop: ",
        middleTop,
        " thirdTop: ",
        thirdTop,
        "firstBottom: ",
        firstBottom
      );
      results[1] = { top: middleTop, left: leftBase };

      // --- Scaling logic ---
      let scale = 1;
      if (gapBetween > MIN_MID_GAP) {
        const availableRightSpace =
          window.innerWidth - (leftBase + measuredWidth);
        if (availableRightSpace > 40) {
          const extra = Math.min(
            0.2,
            Math.min(
              availableRightSpace / measuredWidth,
              gapBetween / measuredHeight - 1
            )
          );
          scale = 1 + extra;
        }
      }

      return results.map((p) => ({ ...p, scale }));
    } else {
      // --- desktop branch unchanged ---
      const baseTop = anchor.top - 35;
      const baseLeft = anchor.right - 15;
      const spacingMultiplier = 1.9;

      const lefts = [
        baseLeft,
        baseLeft * spacingMultiplier + measuredWidth * 0.6,
        baseLeft * spacingMultiplier * 1.5 + measuredWidth * 1.15,
      ];
      const tops = [
        baseTop - measuredHeight * 0.05,
        baseTop + measuredHeight * 0.65,
        baseTop + measuredHeight * 0.55,
      ];

      const limit = floorLimitY - FLOOR_MARGIN;
      for (let i = 0; i < tops.length; i++) {
        const bottom = tops[i] + measuredHeight;
        if (bottom > limit) {
          tops[i] -= bottom - limit;
        }
      }

      // const minVerticalSpacing = Math.max(12, measuredHeight * 0.12);
      // for (let i = 1; i < tops.length; i++) {
      //   const prevBottom = tops[i - 1] + measuredHeight;
      //   if (tops[i] - prevBottom < minVerticalSpacing) {
      //     const needed = minVerticalSpacing - (tops[i] - prevBottom);
      //     tops[i - 1] = Math.max(4, tops[i - 1] - needed);
      //   }
      // }

      const resultsDesktop: { top: number; left: number; scale?: number }[] =
        [];
      for (let i = 0; i < 3; i++) {
        resultsDesktop.push({ top: tops[i], left: lefts[i], scale: 1 });
      }
      return resultsDesktop;
    }
  };

  const positions = computeAllPositions();

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
        style={{
          height: "100%",
          width: "auto",
          objectFit: "cover",
          objectPosition: "left bottom",
        }}
      />

      {/* Paintings container */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto">
        {paintings.map((p, index) => {
          const pos = positions[index] ?? {
            top: anchor.top,
            left: anchor.right + 15,
          };
          return (
            <LandingPainting
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
                top: `${Math.round(pos.top)}px`,
                left: `${Math.round(pos.left)}px`,
              }}
            />
          );
        })}
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
