import React, { useEffect, useRef, useState } from "react";
import LandingPainting from "../components/LandingPainting";
import { motion } from "framer-motion";

export default function Home(): React.JSX.Element {
  const artistRef = useRef<HTMLImageElement | null>(null);
  const paintingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [viewport, setViewport] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [measured, setMeasured] = useState<{
    width: number;
    height: number;
  } | null>(null);

  /* -------------------- Tweakable constants -------------------- */
  const NAV_GAP_VH = 0.02;
  const BOTTOM_GAP_VH = 0.1;
  const MOBILE_PAINTING_WIDTH = "28vw";
  const DESKTOP_PAINTING_WIDTH = "15vw";
  const MOBILE_COLUMN_NUDGE_PX = -6;
  const BRUSH_TIP_OFFSET_PX = 30;
  let DESKTOP_VERTICAL_STEP = 140;
  /* ------------------------------------------------------------- */

  function updateAnchor() {
    if (artistRef.current) {
      const r = artistRef.current.getBoundingClientRect();
      setAnchor({ top: r.top, right: r.left + r.width });
    }
  }

  useEffect(() => {
    function update() {
      updateAnchor();
      setIsMobilePortrait(
        window.innerWidth <= 768 && window.innerHeight > window.innerWidth
      );
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  let paintingSize: number | string = isMobilePortrait
    ? MOBILE_PAINTING_WIDTH
    : DESKTOP_PAINTING_WIDTH;

  const handlePaintingImageLoad = (index: number) => {
    const el = paintingRefs.current[index];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMeasured({ width: r.width, height: r.height });
  };

  const brushX = (() => {
    const right = anchor.right || Math.max(48, viewport.w * 0.12);
    return Math.max(150, Math.round(right - BRUSH_TIP_OFFSET_PX));
  })();

  const computeMobileLeft = () => {
    return brushX + MOBILE_COLUMN_NUDGE_PX;
  };

  const computeDesktopPositions = () => {
    const measuredWidth = measured?.width ?? 200;
    const measuredHeight = measured?.height ?? 140;
    const baseTop = 0;
    const baseLeft = brushX + 10;

    const availableWidth = viewport.w - baseLeft - 40;
    const numGaps = paintings.length - 1;
    const availableHeight = viewport.h - baseTop - 40;
    const heightToWidthRatio = availableHeight / availableWidth;

    const deductionSafety = availableWidth * 0.3;
    const stepH = Math.floor((availableWidth - deductionSafety * 1) / numGaps);

    const scaleFactorWidth =
      (availableWidth - deductionSafety) / (measuredWidth * paintings.length);
    const scaleFactorHeight = availableHeight / (measuredHeight + 50);
    const scale = Math.min(scaleFactorWidth, scaleFactorHeight);

    const paintingWidth = Math.round(measuredWidth * scale);
    paintingSize = paintingWidth;

    DESKTOP_VERTICAL_STEP = availableHeight / 3.8;

    if (heightToWidthRatio < 0.438) {
      DESKTOP_VERTICAL_STEP = DESKTOP_VERTICAL_STEP * 0.2;
    }

    const a = { top: baseTop, left: baseLeft };
    const b = { top: baseTop + DESKTOP_VERTICAL_STEP, left: baseLeft + stepH };
    const c = {
      top: baseTop + Math.round(DESKTOP_VERTICAL_STEP * 0.15),
      left: baseLeft + Math.round(stepH * 2),
    };

    return [a, b, c];
  };

  const paintings = [
    { image: "/images/painting1.jpg", title: "Gallery", to: "/gallery" },
    { image: "/images/painting2.jpg", title: "Contact", to: "/contact" },
    { image: "/images/painting3.jpg", title: "About", to: "/about" },
  ];

  const desktopPositions = computeDesktopPositions();
  const mobileLeft = computeMobileLeft();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 1.5,
        staggerChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -50, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Background wall behind everything */}
      <img
        src="/images/extra-long-wall-short-floor.jpg"
        alt="Gallery Wall"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: "100%",
          width: "auto",
          objectFit: "cover",
          objectPosition: "left bottom",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* paintings container */}
      {isMobilePortrait ? (
        // MOBILE: single column placed to the right of artist (brushX)
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            position: "absolute",
            top: 0,
            left: `${mobileLeft}px`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: `${NAV_GAP_VH * 100}vh`,
            paddingBottom: `${BOTTOM_GAP_VH * 100}vh`,
            gap: "1rem",
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          {paintings.map((p, idx) => (
            <motion.div key={p.title} variants={itemVariants}>
              <LandingPainting
                key={p.title}
                ref={(el: HTMLDivElement | null) => {
                  paintingRefs.current[idx] = el;
                }}
                image={p.image}
                title={p.title}
                to={p.to}
                isMobilePortrait
                width={paintingSize}
                onImageLoad={() => handlePaintingImageLoad(idx)}
                style={{}}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // DESKTOP: absolute, staggered layout anchored to brushX
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            pointerEvents: "auto",
          }}
        >
          {paintings.map((p, idx) => {
            const pos = desktopPositions[idx];
            return (
              <motion.div key={p.title} variants={itemVariants}>
                <LandingPainting
                  ref={(el: HTMLDivElement | null) => {
                    paintingRefs.current[idx] = el;
                  }}
                  image={p.image}
                  title={p.title}
                  to={p.to}
                  isMobilePortrait={false}
                  width={paintingSize}
                  onImageLoad={() => handlePaintingImageLoad(idx)}
                  style={{
                    position: "absolute",
                    left: `${pos.left}px`,
                    top: `${pos.top}px`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Artist (foreground) */}
      <motion.img
        ref={artistRef}
        src="/images/artist_extracted.png"
        alt="Artist"
        onLoad={updateAnchor}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: ["easeIn", "easeOut"], delay: 0.2 }}
        style={{
          position: "absolute",
          left: 0,
          bottom: 1,
          objectFit: "contain",
          maxHeight: "85vh",
          zIndex: 30,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
