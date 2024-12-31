import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Store, User } from "lucide-react";
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Vendors</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-48 p-2">
                {vendorSubmenu.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {authItems}
    </div>
  );
};

export default DesktopMenu;