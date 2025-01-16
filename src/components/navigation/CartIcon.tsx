import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  count: number;
}

const CartIcon = ({ count }: CartIconProps) => {
  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
      {count > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
          variant="destructive"
        >
          {count}
        </Badge>
      )}
    </Link>
  );
};

export default CartIcon;