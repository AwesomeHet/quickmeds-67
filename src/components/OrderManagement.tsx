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

const OrderManagement = () => {
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
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
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
              <TableCell>{order.profiles?.full_name}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderManagement;