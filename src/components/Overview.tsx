import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

const Overview = () => {
  const { data: inventoryStats } = useQuery({
    queryKey: ["inventoryStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("quantity");
      if (error) throw error;
      return data.reduce((acc, item) => acc + item.quantity, 0);
    },
  });

  const { data: ordersStats } = useQuery({
    queryKey: ["ordersStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("total_amount");
      if (error) throw error;
      return {
        count: data.length,
        total: data.reduce((acc, order) => acc + order.total_amount, 0),
      };
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats || 0} units</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersStats?.count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ordersStats?.total?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;