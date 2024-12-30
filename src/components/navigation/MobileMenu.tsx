import { Link } from "react-router-dom";

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  vendorSubmenu: MenuItem[];
  profileSubmenu: MenuItem[];
  onClose: () => void;
}

const MobileMenu = ({
  isOpen,
  menuItems,
  vendorSubmenu,
  profileSubmenu,
  onClose,
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
        {profileSubmenu.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            className="flex items-center w-full px-3 py-2 text-foreground hover:text-primary transition-colors"
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;