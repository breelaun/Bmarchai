import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, User, LogIn, LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/MobileMenu";
import { MenuItem, SubMenuItem } from "./navigation/types";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "CRM", path: "/crm" },
    { name: "Blogs", path: "/blogs" },
    { name: "Streaming", path: "/streaming" },
    { name: "Contact", path: "/contact" },
  ];

  const vendorSubmenu: SubMenuItem[] = [
    { name: "All Vendors", path: "/vendors", icon: <Store className="h-4 w-4 mr-2" /> },
    { name: "Vendor Profile", path: "/vendors/profile", icon: <User className="h-4 w-4 mr-2" /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const profileSubmenu: SubMenuItem[] = [
    { name: "Profile", path: "/profile", icon: <User className="h-4 w-4 mr-2" /> },
    { 
      name: "Logout", 
      path: "#", 
      icon: <LogOut className="h-4 w-4 mr-2" />,
      onClick: handleLogout 
    },
  ];

  const authItems: SubMenuItem[] = [
    { name: "Login", path: "/login", icon: <LogIn className="h-4 w-4" /> },
    { name: "Register", path: "/register", icon: <User className="h-4 w-4" /> },
  ];

  const renderAuthItems = () => {
    if (session) {
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
    }

    return authItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        {item.icon}
        {item.name}
      </Link>
    ));
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-heading font-bold text-primary">Bmarchai</span>
            </Link>
          </div>

          <DesktopMenu 
            menuItems={menuItems}
            vendorSubmenu={vendorSubmenu}
            authItems={renderAuthItems()}
          />

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen}
        menuItems={menuItems}
        vendorSubmenu={vendorSubmenu}
        profileSubmenu={profileSubmenu}
        authItems={authItems}
        onClose={() => setIsOpen(false)}
        session={!!session}
      />
    </nav>
  );
};

export default Navigation;