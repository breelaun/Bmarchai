import { ReactElement } from "react";

export interface MenuItem {
  name: string;
  path: string;
  submenu?: SubMenuItem[];
  onClick?: () => boolean | void;
}

export interface SubMenuItem {
  name: string;
  path: string;
  icon?: ReactElement;
  onClick?: () => void;
}