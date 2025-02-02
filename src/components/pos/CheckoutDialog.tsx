import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profitMargin: number;
  onProfitMarginChange: (value: number) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onComplete: () => void;
};

const CheckoutDialog = ({
  open,
  onOpenChange,
  profitMargin,
  onProfitMarginChange,
  paymentMethod,
  onPaymentMethodChange,
  onComplete,
}: CheckoutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onProfitMarginChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onComplete}>
              Complete Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;