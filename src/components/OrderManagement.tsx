import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const OrderManagement = () => {
  const { toast } = useToast();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:created_by (full_name),
          order_items (
            quantity,
            unit_price,
            total_price,
            inventory_items (name)
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approveOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ admin_approved: true, status: "completed" })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve order",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order approved successfully",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Profit Margin</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "completed"
                      ? "default"
                      : order.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {order.order_items
                  ?.map((item) => `${item.inventory_items.name} (${item.quantity})`)
                  .join(", ")}
              </TableCell>
              <TableCell>${order.total_amount.toFixed(2)}</TableCell>
              <TableCell>{order.profit_margin}%</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Badge variant="outline" className="mb-1">
                    {order.payment_method}
                  </Badge>
                  <Badge
                    variant={
                      order.payment_status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{order.profiles?.full_name}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {order.status === "pending" && !order.admin_approved && (
                  <Button
                    size="sm"
                    onClick={() => approveOrder(order.id)}
                  >
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderManagement;