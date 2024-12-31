import { Link } from "react-router-dom";
import { MenuItem, SubMenuItem } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  vendorSubmenu: SubMenuItem[];
  profileSubmenu?: SubMenuItem[];
  authItems: SubMenuItem[];
  onClose: () => void;
  session: boolean;
}

const MobileMenu = ({ 
  isOpen, 
  menuItems, 
  vendorSubmenu, 
  profileSubmenu,
  authItems,
  onClose,
  session
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
            onClick={onClose}
          >
            {item.name}
          </Link>
        ))}
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
        {session ? (
          profileSubmenu?.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                onClose();
                item.onClick?.();
              }}
              className="flex items-center px-3 py-2 text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {item.icon}
              {item.name}
            </div>
          ))
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
  );
};

export default MobileMenu;