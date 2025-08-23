import { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";

function Home() {
  const artistRef = useRef<HTMLImageElement | null>(null);
  const paintingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  // Tweakables
  const BRUSH_Y_FRACTION = 0.25; // shift anchor downward from artist top (adjust so painting matches brush tip)
  const MOBILE_NUDGE = { x: -55, y: -30 }; // px nudge for mobile column
  const FLOOR_MIN_PX = 50; // min floor region in px
  const FLOOR_VIEWPORT_FRACTION = 0.12; // floor size as fraction of viewport if bigger than min px
  const FLOOR_MARGIN = 8; // gap above floor
  const SPACING_MULTIPLIER = isMobilePortrait ? 1.3 : 0.65; // used for spacing
  const MIN_STACK_SPACING_PX = 12; // fallback minimum spacing px

  // breakpoints: tablet handling so paintings don't become huge
  const isTablet =
    typeof window !== "undefined" && window.innerWidth > 760 && window.innerWidth <= 1100;

  // update anchor, portrait flag, viewport height on resize/orientation change
  useEffect(() => {
    function updatePosition() {
      if (artistRef.current) {
        const rect = artistRef.current.getBoundingClientRect();
        // anchor top is moved down a bit to match artist's brush location better
        const anchorTop = rect.top + rect.height * BRUSH_Y_FRACTION;
        setAnchor({ top: anchorTop, right: rect.left + rect.width });
      }
      const portrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
      setIsMobilePortrait(portrait);
      setViewportHeight(window.innerHeight);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
    };
  }, []);

  // size logic with tablet fallback
  const paintingSize = isMobilePortrait ? "28vw" : isTablet ? "18vw" : "15vw";

  const handlePaintingImageLoad = (index: number) => {
    const el = paintingRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMeasured({ width: r.width, height: r.height });
  };

  // compute floor height adaptively
  const floorHeightPx = Math.max(FLOOR_MIN_PX, viewportHeight * FLOOR_VIEWPORT_FRACTION);
  const floorLimitY = viewportHeight - floorHeightPx; // top Y coordinate above which content is allowed

  // This function returns positions computed by the "old" logic you liked,
  // then we do a final, minimal correction pass that only moves items UP if they're crossing the floor.
  const computeAllPositions = () => {
    const measuredHeight = measured?.height ?? 200;
    const measuredWidth = measured?.width ?? 150;
    const results: { top: number; left: number }[] = [];

    if (isMobilePortrait) {
      // old-style stacked positions (keeps your original approach)
      const topBase = anchor.top + MOBILE_NUDGE.y;
      const leftBase = anchor.right + 15 + MOBILE_NUDGE.x;
      const spacingPx = Math.max(MIN_STACK_SPACING_PX, measuredHeight * 0.18); // ensures minimum spacing
      const spacing = measuredHeight * SPACING_MULTIPLIER;

      for (let i = 0; i < 3; i++) {
        const top = topBase + i * spacing;
        results.push({ top, left: leftBase });
      }

      // keep at least spacingPx between stacked items
      for (let i = 1; i < results.length; i++) {
        const prevBottom = results[i - 1].top + measuredHeight;
        if (results[i].top - prevBottom < spacingPx) {
          results[i].top = prevBottom + spacingPx;
        }
      }

      // --- FINAL correction: if any painting is below the floor, nudge it up ---
      // We only move items upward, and we propagate upward shifts to keep spacing.
      for (let i = results.length - 1; i >= 0; i--) {
        const bottom = results[i].top + measuredHeight;
        const limit = floorLimitY - FLOOR_MARGIN;
        if (bottom > limit) {
          const delta = bottom - limit;
          // move this one up
          results[i].top -= delta;
          // if this now overlaps previous ones, push them up as needed
          for (let j = i - 1; j >= 0; j--) {
            const desiredBottom = results[j + 1].top - spacingPx;
            const currentBottom = results[j].top + measuredHeight;
            if (currentBottom > desiredBottom) {
              const moveUp = currentBottom - desiredBottom;
              results[j].top -= moveUp;
            } else {
              break;
            }
          }
        }
      }

      // clamp top to viewport (don't push above top)
      for (let i = 0; i < results.length; i++) {
        results[i].top = Math.max(4, results[i].top);
      }

      return results;
    } else {
      // Desktop / landscape — diagonal stagger relative to anchor + measured size
      // Tuned multipliers for pleasing stagger (first at brush tip, second lower-right, third higher-right)
      const baseTop = anchor.top - 35;
      const baseLeft = anchor.right - 15;
      const spacingMultiplier = 1.9; // tweak to taste for horizontal spacing

      // replicate your old calculations into arrays
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

      // enforce floor by nudging each painting up if necessary (minimal change)
      const limit = floorLimitY - FLOOR_MARGIN;
      for (let i = 0; i < 3; i++) {
        const bottom = tops[i] + measuredHeight;
        if (bottom > limit) {
          const delta = bottom - limit;
          tops[i] -= delta;
        }
      }

      // ensure minimal vertical spacing between paintings so they don't collapse into each other
      const minVerticalSpacing = Math.max(12, measuredHeight * 0.12);
      for (let i = 1; i < 3; i++) {
        const prevBottom = tops[i - 1] + measuredHeight;
        if (tops[i] - prevBottom < minVerticalSpacing) {
          // try moving previous up minimally (without moving anything else)
          const needed = minVerticalSpacing - (tops[i] - prevBottom);
          tops[i - 1] = Math.max(4, tops[i - 1] - needed);
        }
      }

      // produce numeric results array
      for (let i = 0; i < 3; i++) {
        results.push({ top: tops[i], left: lefts[i] });
      }
      return results;
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
        style={{ height: "100%", width: "auto", objectFit: "cover", objectPosition: "left bottom" }}
      />

      {/* Paintings container */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto">
        {paintings.map((p, index) => {
          const pos = positions[index] ?? { top: anchor.top, left: anchor.right + 15 };
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
