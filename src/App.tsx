import { useState } from 'react'

import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from "./pages/Home";
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import About from './pages/About';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />
      <main className="px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          {/* <Route path="/sale" element={<Sale />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
