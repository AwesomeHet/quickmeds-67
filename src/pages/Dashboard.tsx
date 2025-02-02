import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import InventoryManagement from "@/components/InventoryManagement";
import OrderManagement from "@/components/OrderManagement";
import UserManagement from "@/components/UserManagement";
import Overview from "@/components/Overview";
import POSSystem from "@/components/POSSystem";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="pos" element={<POSSystem />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;