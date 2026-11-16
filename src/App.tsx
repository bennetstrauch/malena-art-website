import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import GalleryImageView from "./pages/GalleryImageView";
import Shop from "./pages/Shop";
import ShopOriginals from "./pages/ShopOriginals";
import ShopCalendar from "./pages/ShopCalendar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/originals" element={<ShopOriginals />} />
            <Route path="/shop/calendar" element={<ShopCalendar />} />
            {/* Old /sales URL redirects to the new Shop */}
            <Route path="/sales" element={<Navigate to="/shop" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery/:year/:filename" element={<GalleryImageView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}


export default App;
