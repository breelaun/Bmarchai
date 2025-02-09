import { Link } from "react-router-dom";
import { MenuItem, SubMenuItem } from "./types";
import CartIcon from "./CartIcon";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  vendorSubmenu: SubMenuItem[];
  profileSubmenu?: SubMenuItem[];
  authItems: SubMenuItem[];
  onClose: () => void;
  session: boolean;
  cartItemsCount: number;
}

const MobileMenu = ({ 
  isOpen, 
  menuItems, 
  vendorSubmenu, 
  profileSubmenu,
  authItems,
  onClose,
  session,
  cartItemsCount
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full overflow-y-auto scrollbar-none">
          <div className="px-2 pt-2 pb-3 min-h-screen sm:px-3">
            {menuItems.map((item) => (
              <div key={item.name} className="space-y-1">
                {/* Main menu item */}
                <Link
                  to={item.path}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
                
                {/* Submenu items */}
                {item.submenu && (
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        {subItem.icon}
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Vendor submenu */}
            <div className="pt-2">
              {vendorSubmenu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth section */}
            <div className="pt-2 border-t border-border mt-2">
              {session ? (
                <>
                  {profileSubmenu?.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => {
                        onClose();
                        if (item.name === "Profile") {
                          return;
                        }
                        item.onClick?.();
                      }}
                      className="flex items-center px-3 py-2 text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.name === "Profile" ? (
                        <Link
                          to="/profile"
                          className="flex items-center w-full"
                          onClick={onClose}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ) : (
                        <>
                          {item.icon}
                          {item.name}
                        </>
                      )}
                    </div>
                  ))}
                  <div className="px-3 py-2">
                    <CartIcon count={cartItemsCount} />
                  </div>
                </>
              ) : (
                authItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={onClose}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
