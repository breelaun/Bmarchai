import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuItem, SubMenuItem } from "./types";
import CartIcon from "./CartIcon";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  vendorSubmenu: SubMenuItem[];
  profileSubmenu: SubMenuItem[];
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
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
          <div className="space-y-4 py-4">
            {menuItems.map((item) => (
              <div key={item.path} className="px-3">
                {item.submenu ? (
                  <div className="space-y-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="pl-4 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.path}
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                          onClick={onClose}
                        >
                          <Link to={subItem.path}>
                            {subItem.icon}
                            {subItem.name}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={onClose}
                  >
                    <Link to={item.path}>{item.name}</Link>
                  </Button>
                )}
              </div>
            ))}

            {session && (
              <>
                <div className="px-3">
                  <h4 className="mb-2 font-medium">Profile</h4>
                  <div className="space-y-2">
                    {profileSubmenu.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          onClose();
                        }}
                        asChild={!item.onClick}
                      >
                        {item.onClick ? (
                          <div className="flex items-center">
                            {item.icon}
                            {item.name}
                          </div>
                        ) : (
                          <Link to={item.path}>
                            {item.icon}
                            {item.name}
                          </Link>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="px-3">
                  <h4 className="mb-2 font-medium">Vendor</h4>
                  <div className="space-y-2">
                    {vendorSubmenu.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                        onClick={onClose}
                      >
                        <Link to={item.path}>
                          {item.icon}
                          {item.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="px-3">
                  <CartIcon count={cartItemsCount} />
                </div>
              </>
            )}

            {!session && (
              <div className="px-3">
                <h4 className="mb-2 font-medium">Auth</h4>
                <div className="space-y-2">
                  {authItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                      onClick={onClose}
                    >
                      <Link to={item.path}>
                        {item.icon}
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;