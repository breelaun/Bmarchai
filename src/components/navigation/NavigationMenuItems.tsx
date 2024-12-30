import { Store, User, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface NavigationMenuItemsProps {
  vendorSubmenu: MenuItem[];
  profileSubmenu: MenuItem[];
}

const NavigationMenuItems = ({ vendorSubmenu, profileSubmenu }: NavigationMenuItemsProps) => {
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
        <NavigationMenuItem>
          <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              {profileSubmenu.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-left"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuItems;