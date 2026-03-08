import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Stats from "./pages/Stats";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminRiders from "./pages/admin/AdminRiders";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorStockUpdate from "./pages/vendor/VendorStockUpdate";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorSales from "./pages/vendor/VendorSales";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderDeliveries from "./pages/rider/RiderDeliveries";
import RiderEarnings from "./pages/rider/RiderEarnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/vendors" element={<ProtectedRoute requiredRole="admin"><AdminVendors /></ProtectedRoute>} />
            <Route path="/admin/riders" element={<ProtectedRoute requiredRole="admin"><AdminRiders /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />

            {/* Vendor */}
            <Route path="/vendor" element={<ProtectedRoute requiredRole="vendor"><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/products" element={<ProtectedRoute requiredRole="vendor"><VendorProducts /></ProtectedRoute>} />
            <Route path="/vendor/stock" element={<ProtectedRoute requiredRole="vendor"><VendorStockUpdate /></ProtectedRoute>} />
            <Route path="/vendor/orders" element={<ProtectedRoute requiredRole="vendor"><VendorOrders /></ProtectedRoute>} />
            <Route path="/vendor/sales" element={<ProtectedRoute requiredRole="vendor"><VendorSales /></ProtectedRoute>} />

            {/* Rider */}
            <Route path="/rider" element={<ProtectedRoute requiredRole="rider"><RiderDashboard /></ProtectedRoute>} />
            <Route path="/rider/deliveries" element={<ProtectedRoute requiredRole="rider"><RiderDeliveries /></ProtectedRoute>} />
            <Route path="/rider/earnings" element={<ProtectedRoute requiredRole="rider"><RiderEarnings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
