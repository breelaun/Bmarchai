import { Link } from "react-router-dom";

interface NavigationLink {
  name: string;
  path: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
  onClose?: () => void;
}

const NavigationLinks = ({ links, onClose }: NavigationLinksProps) => {
  return (
    <>
      {links.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-foreground hover:text-primary transition-colors"
          onClick={onClose}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavigationLinks;