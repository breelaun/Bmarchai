import { Link } from "react-router-dom";
import type { SubMenuItem } from "./types";

interface AuthButtonsProps {
  authItems: SubMenuItem[];
}

const AuthButtons = ({ authItems }: AuthButtonsProps) => {
  return (
    <>
      {authItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default AuthButtons;