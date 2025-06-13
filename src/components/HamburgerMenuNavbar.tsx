// src/components/HamburgerMenuForNavbar.tsx
import { navLinks } from "./Navbar";
import { Link, useLocation } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const HamburgerMenuForNavbar = ({ isOpen, onClose }: Props) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-2 flex justify-end pr-4">
      <ul className="flex flex-col items-end space-y-2 text-sm font-medium bg-white p-4 border rounded shadow">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={onClose}
              className={`block px-2 py-1 ${
                location.pathname === link.to
                  ? "text-blue-500"
                  : "hover:text-blue-400"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HamburgerMenuForNavbar;
