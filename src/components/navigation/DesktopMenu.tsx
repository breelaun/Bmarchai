import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MenuItem, SubMenuItem } from "./types";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  vendorSubmenu: SubMenuItem[];
  authItems: ReactNode;
}

const DesktopMenu = ({ menuItems, vendorSubmenu, authItems }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-8">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-foreground hover:text-primary transition-colors"
        >
          {item.name}
        </Link>
      ))}
      {authItems}
    </div>
  );
};

export default DesktopMenu;