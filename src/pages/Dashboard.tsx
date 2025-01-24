import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import InventoryManagement from "@/components/InventoryManagement";
import OrderManagement from "@/components/OrderManagement";
import UserManagement from "@/components/UserManagement";
import Overview from "@/components/Overview";

const Dashboard = () => {
  // Temporarily bypass authentication checks
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;