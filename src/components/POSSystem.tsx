import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Printer, ShoppingCart } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

const POSSystem = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profitMargin, setProfitMargin] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Calculate total amount
      const totalAmount = cart.reduce((sum, item) => sum + item.total_price, 0);
      const orderWithMargin = totalAmount * (1 + profitMargin / 100);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            total_amount: orderWithMargin,
            profit_margin: profitMargin,
            payment_method: paymentMethod,
            status: profitMargin > 0 ? "pending" : "completed",
            admin_approved: profitMargin === 0,
            created_by: user.id, // Add the user ID here
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        item_id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update inventory quantities
      for (const item of cart) {
        const { error: updateError } = await supabase
          .from("inventory_items")
          .update({
            quantity: inventory?.find((i) => i.id === item.id)?.quantity! - item.quantity,
          })
          .eq("id", item.id);

        if (updateError) throw updateError;
      }

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setCart([]);
      setIsCheckoutDialogOpen(false);
      toast({
        title: "Order created successfully",
        description: profitMargin > 0 
          ? "Order is pending admin approval"
          : "Order has been completed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCart = (item: any) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((i) => i.id === item.id);
      if (existingItem) {
        return currentCart.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                total_price: (i.quantity + 1) * i.unit_price,
              }
            : i
        );
      }
      return [
        ...currentCart,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          unit_price: item.unit_price,
          total_price: item.unit_price,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              total_price: quantity * item.unit_price,
            }
          : item
      )
    );
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create orders",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to access the POS system.</p>
      </div>
    );
  }

  // ... keep existing code (JSX for inventory and cart sections)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Inventory Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {inventory?.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => addToCart(item)}
              disabled={item.quantity < 1}
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground">
                ${item.unit_price}
              </span>
              <span className="text-sm text-muted-foreground">
                Stock: {item.quantity}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
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
                      updateQuantity(item.id, parseInt(e.target.value))
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
                    onClick={() => removeFromCart(item.id)}
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
            Total: $
            {cart.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}
          </div>
          <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={cart.length === 0}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profit Margin (%)</Label>
                  <Input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 space-x-2 flex justify-end">
                  <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCheckout}>
                    Complete Order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;
