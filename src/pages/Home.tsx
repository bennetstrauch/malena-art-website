import LandingPainting from "../components/LandingPainting";

function Home() {
  return (
// #changed 

<div className="relative w-screen min-h-screen overflow-auto bg-white z-0">
<div className="relative w-full flex flex-wrap justify-center items-start gap-8 p-4">
    <img
      src="/images/artist-wall-bg.jpeg"
      alt="Artist painting wall"
      className="block object-left-top object-cover w-auto h-full max-w-none"
style={{ width: "100%", height: "100%" }}
    />

       
            {/* Painting 1 */}
          <LandingPainting
            image="/images/painting1.jpg"
            title="Gallery"
            to="/gallery"
            //   Position of Nav-Image:
            style={{ top: "10%", left: "22.8%" }}
          />

          {/* Painting 2 */}
          <LandingPainting
            image="/images/painting2.jpg"
            title="Contact"
            to="/contact"
            style={{ top: "40%", left: "49%" }}
          />

          {/* Painting 3 */}
          <LandingPainting
            image="/images/painting3.jpg"
            title="About"
            to="/about"
            style={{ top: "6%", left: "76%" }}
          />
        </div>
      </div>
 

    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //     <h1 className="text-4xl font-bold mb-4">Welcome to Malena Strauch's Website</h1>
    //     <p className="text-lg text-gray-700">Explore the gallery, shop for art, or learn more about the artist.</p>
    // </div>
  );
}

export default Home;
