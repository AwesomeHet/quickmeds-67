import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Navigate } from "react-router-dom";
import InventorySection from "./pos/InventorySection";
import CartSection from "./pos/CartSection";
import CheckoutDialog from "./pos/CheckoutDialog";
import { CartItem } from "./pos/types";

const POSSystem = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profitMargin, setProfitMargin] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const totalAmount = cart.reduce((sum, item) => sum + item.total_price, 0);
      const orderWithMargin = totalAmount * (1 + profitMargin / 100);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            total_amount: orderWithMargin,
            profit_margin: profitMargin,
            payment_method: paymentMethod,
            status: profitMargin > 0 ? "pending" : "completed",
            admin_approved: profitMargin === 0,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

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
            quantity: item.quantity,
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

  const removeFromCart = (itemId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    createOrderMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InventorySection onAddToCart={addToCart} />
      <CartSection
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={() => setIsCheckoutDialogOpen(true)}
      />
      <CheckoutDialog
        open={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
        profitMargin={profitMargin}
        onProfitMarginChange={setProfitMargin}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onComplete={handleCheckout}
      />
    </div>
  );
};

export default POSSystem;