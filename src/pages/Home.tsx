import LandingPainting from "../components/LandingPainting";

function Home() {
  return (

<div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-white z-0">
  <div className="relative w-full h-full flex justify-start items-start">
    <img
      src="/images/artist-wall-bg.jpeg"
      alt="Artist painting wall"
      className="block object-left-top object-cover w-auto h-full max-w-none"
      style={{ maxWidth: "none", minWidth: "100vw" }}
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
