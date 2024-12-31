import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import type { SubMenuItem } from "./types";

interface ProfileMenuProps {
  profileSubmenu: SubMenuItem[];
}

const ProfileMenu = ({ profileSubmenu }: ProfileMenuProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-48 p-2">
              {profileSubmenu.map((item) => (
                item.onClick ? (
                  <div
                    key={item.name}
                    onClick={item.onClick}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                  >
                    {item.icon}
                    {item.name}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProfileMenu;