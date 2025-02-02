import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "./types";

type CartSectionProps = {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onCheckout: () => void;
};

const CartSection = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}: CartSectionProps) => {
  const total = cart.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Current Order</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>${item.unit_price}</TableCell>
              <TableCell>${item.total_price.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(item.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">
          Total: ${total.toFixed(2)}
        </div>
        <Button onClick={onCheckout} disabled={cart.length === 0}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartSection;