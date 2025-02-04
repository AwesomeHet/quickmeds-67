import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/integrations/mongodb/client";
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
      const collection = await getCollection("orders");
      return collection.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "created_by",
            foreignField: "_id",
            as: "profiles"
          }
        },
        {
          $lookup: {
            from: "order_items",
            localField: "_id",
            foreignField: "order_id",
            as: "order_items"
          }
        },
        {
          $lookup: {
            from: "inventory_items",
            localField: "order_items.item_id",
            foreignField: "_id",
            as: "inventory_items"
          }
        },
        { $sort: { created_at: -1 } }
      ]).toArray();
    },
  });

  const approveOrder = async (orderId) => {
    try {
      const collection = await getCollection("orders");
      await collection.updateOne(
        { _id: orderId },
        { $set: { admin_approved: true, status: "completed" } }
      );
      
      toast({
        title: "Success",
        description: "Order approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve order",
        variant: "destructive",
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
            <TableRow key={order._id}>
              <TableCell className="font-medium">
                {order._id.toString().slice(0, 8)}...
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
                    onClick={() => approveOrder(order._id)}
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
