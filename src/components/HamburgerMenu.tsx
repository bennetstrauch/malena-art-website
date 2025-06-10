// src/components/HamburgerMenu.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./Navbar";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const links = navLinks;

  return (
    <div className="absolute top-4 right-4 z-50">
      <button onClick={toggleMenu} className="focus:outline-none">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="black"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 bg-white shadow-md border rounded p-2 text-sm space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={closeMenu}
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
        </ul>
      )}
    </div>
  );
}
