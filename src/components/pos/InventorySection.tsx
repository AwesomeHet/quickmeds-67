import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type InventoryItem = {
  id: string;
  name: string;
  unit_price: number;
  quantity: number;
};

type InventorySectionProps = {
  onAddToCart: (item: InventoryItem) => void;
};

const InventorySection = ({ onAddToCart }: InventorySectionProps) => {
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

  if (isLoading) return <div>Loading inventory...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Available Items</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {inventory?.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
            onClick={() => onAddToCart(item)}
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
  );
};

export default InventorySection;