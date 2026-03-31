import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ✅ CONSTANTS — labelKey maps to i18n keys, to is the route
export const navLinks = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.gallery", to: "/gallery" },
  { labelKey: "nav.sales", to: "/sales" },
  { labelKey: "nav.contact", to: "/contact" },
  { labelKey: "nav.about", to: "/about" },
];

// ✅ MAIN COMPONENT
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo + Instagram */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-semibold tracking-wide truncate break-words"
          >
            MALENA STRAUCH
          </Link>
          <InstagramButton />
        </div>

        {/* Right: Hamburger + Desktop Menu + Language Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              aria-label="Hamburger menu"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <NavLinks onClick={closeMenu} />
            <li>
              <LanguageToggle />
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ MOBILE MENU - aligned right */}
      {isOpen && (
        <div className="md:hidden mt-2 flex justify-end">
          <ul className="flex flex-col items-end text-right space-y-2 pr-3 text-sm font-medium">
            <NavLinks onClick={closeMenu} />
            <li>
              <LanguageToggle />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

// ✅ SUBCOMPONENT: Nav Links
const NavLinks = ({ onClick }: { onClick: () => void }) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <>
      {navLinks.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={onClick}
            className={`block px-2 py-1 ${
              location.pathname === link.to
                ? "text-cyan-600"
                : "hover:text-amber-600"
            }`}
          >
            {t(link.labelKey)}
          </Link>
        </li>
      ))}
    </>
  );
};

// ✅ SUBCOMPONENT: Language Toggle
const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("de") ? "de" : "en";

  const setLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex items-center text-sm font-medium">
      <button
        onClick={() => setLang("en")}
        className={current === "en" ? "text-cyan-600" : "hover:text-amber-600"}
      >
        EN
      </button>
      <span className="mx-1 text-gray-300">|</span>
      <button
        onClick={() => setLang("de")}
        className={current === "de" ? "text-cyan-600" : "hover:text-amber-600"}
      >
        DE
      </button>
    </div>
  );
};

// ✅ REFACTORED: Instagram button as JSX component
const InstagramButton = () => (
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
