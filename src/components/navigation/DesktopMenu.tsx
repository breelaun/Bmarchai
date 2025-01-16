import { Link } from "react-router-dom";
import { Store, Calendar } from "lucide-react";
import { MenuItem, SubMenuItem } from "./types";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  vendorSubmenu: SubMenuItem[];
  session: boolean;
  cartItemsCount: number;
}

const DesktopMenu = ({ menuItems, vendorSubmenu, session, cartItemsCount }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-8">
      {menuItems.map((item) => (
        item.submenu ? (
          <div key={item.name} className="relative group">
            <button className="text-foreground hover:text-primary transition-colors">
              {item.name}
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.path}
                    className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/50"
                  >
                    {subItem.icon}
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={item.name}
            to={item.path}
            className="text-foreground hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
        )
      ))}
    </div>
  );
};

export default DesktopMenu;