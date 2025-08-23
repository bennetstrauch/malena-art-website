import { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";

function Home() {
  const artistRef = useRef<HTMLImageElement | null>(null);
  const paintingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 0);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

  // tweakables
  const NAV_GAP_VH = 0.02; // gap from nav (vh)
  const BOTTOM_GAP_VH = 0.18; // gap from bottom (vh)
  const MIN_VERTICAL_GAP = 40; // px minimum acceptable gap
  const MOBILE_NUDGE_X = -20;

  const FLOOR_MIN_PX = 60;
  const FLOOR_VIEWPORT_FRACTION = 0.12;
  const FLOOR_MARGIN = 8;

  // update anchor and layout flags
  useEffect(() => {
    function updatePosition() {
      if (artistRef.current) {
        const rect = artistRef.current.getBoundingClientRect();
        setAnchor({ top: rect.top, right: rect.left + rect.width });
      }
      const portrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(portrait);
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, []);

  const paintingSize = isMobilePortrait ? "28vw" : "15vw";

  const handlePaintingImageLoad = (index: number) => {
    const el = paintingRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMeasured({ width: r.width, height: r.height });
  };

  // floor limit (desktop correction)
  const floorHeightPx = Math.max(FLOOR_MIN_PX, viewportHeight * FLOOR_VIEWPORT_FRACTION);
  const floorLimitY = viewportHeight - floorHeightPx;

  // DESKTOP LOGIC
  const computeDesktopPositions = () => {
    const measuredHeight = measured?.height ?? 200;
    const measuredWidth = measured?.width ?? 150;
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
      baseTop + measuredHeight * 0.15,
    ];

    // floor correction
    const limit = floorLimitY - FLOOR_MARGIN;
    for (let i = 0; i < tops.length; i++) {
      const bottom = tops[i] + measuredHeight;
      if (bottom > limit) {
        tops[i] -= bottom - limit;
      }
    }

    const results: { top: number; left: number; scale: number }[] = [];
    for (let i = 0; i < 3; i++) results.push({ top: tops[i], left: lefts[i], scale: 1 });
    return results;
  };

  // MOBILE/TABLET LOGIC
  const computeMobilePositions = () => {
    const brushX = (anchor.right || 60) + MOBILE_NUDGE_X;
    const zoneWidth = viewportWidth - brushX;

    const measuredHeight = measured?.height ?? 200;
    const measuredWidth = measured?.width ?? 150;

    const firstTop = NAV_GAP_VH * viewportHeight;
    const thirdTop = viewportHeight - (BOTTOM_GAP_VH * viewportHeight) - measuredHeight;
    const middleTop = (firstTop + measuredHeight + thirdTop) / 2 - measuredHeight / 2;

    // check gaps
    const gap1 = middleTop - (firstTop + measuredHeight);
    const gap2 = thirdTop - (middleTop + measuredHeight);

    let scale = 1;
    if (gap1 > MIN_VERTICAL_GAP && gap2 > MIN_VERTICAL_GAP && zoneWidth > measuredWidth * 1.2) {
      // scale up a bit to use space
      const extraScale = Math.min(1.3, zoneWidth / measuredWidth);
      scale = extraScale;
    }

    return [
      { top: firstTop, left: brushX, scale },
      { top: middleTop, left: brushX, scale },
      { top: thirdTop, left: brushX, scale },
    ];
  };

  const paintings = [
    { image: "/images/painting1.jpg", title: "Gallery", to: "/gallery" },
    { image: "/images/painting2.jpg", title: "Contact", to: "/contact" },
    { image: "/images/painting3.jpg", title: "About", to: "/about" },
  ];

  const positions = isMobilePortrait ? computeMobilePositions() : computeDesktopPositions();

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Background Wall */}
      <img
        src="/images/extra-long-wall-short-floor.jpg"
        alt="Gallery Wall"
        className="absolute bottom-0 left-0 z-0 pointer-events-none"
        style={{ height: "100%", width: "auto", objectFit: "cover", objectPosition: "left bottom" }}
      />

      {/* Paintings */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto">
        {paintings.map((p, index) => {
          const pos = positions[index];
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
                width: `calc(${paintingSize} * ${pos.scale})`,
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
        className="absolute left-0 z-20 pointer-events-none"
        style={{ bottom: "1px", objectFit: "contain", maxHeight: "85vh" }}
      />
    </div>
  );
}

export default Home;
