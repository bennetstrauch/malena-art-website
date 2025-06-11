import LandingPainting from "../components/LandingPainting";

function Home() {
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
          style={{ top: "5%", left: "155px", }}
        />
        <LandingPainting
          image="/images/painting2.jpg"
          title="Contact"
          to="/contact"
          style={{ top: "40%", right: "38%" }}
        />
        <LandingPainting
          image="/images/painting3.jpg"
          title="About"
          to="/about"
          style={{ top: "12%", right: "10%" }}
        />
      </div>

      {/* Foreground Artist (click-through) */}
      <img
        src="/images/artist_extracted.png"
        alt="Malena painting"
        className="absolute bottom-1 left-0 h-full z-20 pointer-events-none"
        style={{ objectFit: "contain", maxHeight: "85vh" }}
      />
    </div>
  );
}

export default Home;
