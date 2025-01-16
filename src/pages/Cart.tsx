import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Start shopping to add items to your cart.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                {item.product.image_url && (
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-muted-foreground">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product_id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
            <Button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Cart;