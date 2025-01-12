import { ReactNode } from "react";

export interface MenuItem {
  name: string;
  path: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem extends MenuItem {
  icon: ReactNode;
  onClick?: () => void;
}

export interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}