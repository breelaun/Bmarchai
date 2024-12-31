import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import type { SubMenuItem } from "./types";

interface VendorMenuProps {
  vendorSubmenu: SubMenuItem[];
}

const VendorMenu = ({ vendorSubmenu }: VendorMenuProps) => {
  return (
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
  );
};

export default VendorMenu;