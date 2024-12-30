import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, User, LogIn, LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "CRM", path: "/crm" },
    { name: "Blogs", path: "/blogs" },
    { name: "Streaming", path: "/streaming" },
    { name: "Contact", path: "/contact" },
  ];

  const vendorSubmenu = [
    { name: "All Vendors", path: "/vendors", icon: <Store className="h-4 w-4 mr-2" /> },
    { name: "Vendor Profile", path: "/vendors/profile", icon: <User className="h-4 w-4 mr-2" /> },
  ];

  const profileSubmenu = session
    ? [
        { 
          name: "Profile", 
          path: "/profile", 
          icon: <User className="h-4 w-4 mr-2" />,
          onClick: () => navigate("/profile")
        },
        { 
          name: "Logout", 
          path: "#", 
          icon: <LogOut className="h-4 w-4 mr-2" />,
          onClick: handleLogout
        },
      ]
    : [
        { 
          name: "Login", 
          path: "/login", 
          icon: <LogIn className="h-4 w-4 mr-2" />,
          onClick: () => navigate("/login")
        },
        { 
          name: "Register", 
          path: "/register", 
          icon: <User className="h-4 w-4 mr-2" />,
          onClick: () => navigate("/register")
        },
      ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-heading font-bold text-primary">Bmarchai</span>
            </Link>
          </div>

          {/* Desktop Menu */}
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
          </div>

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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {vendorSubmenu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            {profileSubmenu.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;