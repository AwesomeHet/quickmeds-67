import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Temporary mock profile for development
  const mockProfile = {
    full_name: "Development User",
    role: "superadmin",
  };

  const menuItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/inventory", label: "Inventory", icon: Package },
    { path: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    {
      path: "/dashboard/users",
      label: "Users",
      icon: Users,
      roles: ["superadmin", "admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || (mockProfile?.role && item.roles.includes(mockProfile.role))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white h-screen fixed">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">QuickMeds</h1>
          </div>
          <nav className="flex-1 p-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-lg mb-2 ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Signed in as:</p>
              <p className="font-medium">{mockProfile?.full_name}</p>
              <p className="text-sm text-gray-600 capitalize">{mockProfile?.role}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {}}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile menu button */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">QuickMeds</h1>
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40 pt-20">
            <nav className="p-4">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2 rounded-lg mb-2 ${
                      location.pathname === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Signed in as:</p>
                  <p className="font-medium">{mockProfile?.full_name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {mockProfile?.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {}}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;