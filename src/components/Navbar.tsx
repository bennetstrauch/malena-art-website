// src/components/Navbar.tsx
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export const navLinks = [
  { name: "Home", to: "/" },
  { name: "Gallery", to: "/gallery" },
  { name: "Sales", to: "/sales" },
  { name: "Contact", to: "/contact" },
  { name: "About", to: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-semibold tracking-wide"
          >
            MALENA STRAUCH
          </Link>

          {instagramButton}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLinks onClick={closeMenu} />
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2">
          <ul className="flex flex-col space-y-2 text-sm font-medium">
            <NavLinks onClick={closeMenu} />
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ onClick }: { onClick: () => void }) => {
  const location = useLocation();

  return (
    <>
      {navLinks.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={onClick}
            className={`block px-2 py-1 ${
              location.pathname === link.to
                ? "text-blue-600"
                : "hover:text-blue-500"
            }`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </>
  );
};

const instagramButton = (
  <a
    href="https://www.instagram.com/malenastrauch"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-blue-600"
    aria-label="Instagram"
    style={{
      paddingLeft: "2px",
      paddingRight: "10px",
      position: "relative",
      top: "1px",
    }}
  >
    <FaInstagram size={24} />
  </a>
);

export default Navbar;
