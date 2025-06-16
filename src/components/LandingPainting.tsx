import { Link } from "react-router-dom";
import { isMobile } from "../pages/Home";

interface LandingPaintingProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  image: string;
  title: string;
  to: string;
  style?: React.CSSProperties;
}

const LandingPainting = ({ ref, image, title, to, style }: LandingPaintingProps) => (
   <Link to={to} className="absolute" style={style}>
    <div ref={ref} className="flex flex-col items-end group cursor-pointer"
         style={{ width: '20vw', minWidth: '100px', maxWidth:'200px', fontSize: '2.4vw'}}>
      <img
        src={image}
        alt={title}
        className="w-full h-auto  object-cover shadow-md group-hover:scale-105 transition-transform"
      />
      <span className="mt-1 text-gray-700 group-hover:text-blue-600 text-right mr-2"
        style={ isMobile ? { fontSize: '3vh'} : {}}>
        {title}
      </span>
    </div>
  </Link>
);

export default LandingPainting;
