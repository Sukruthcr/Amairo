import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Store, Package, TrendingUp, ClipboardCheck, ShoppingCart, BarChart3 } from "lucide-react";

const VendorDashboard = () => {
  const { user } = useAuth();

  const { data: productCount = 0 } = useQuery({
    queryKey: ["vendor-dash-products", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("vendor_id", user!.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: todayOrders = 0 } = useQuery({
    queryKey: ["vendor-dash-orders", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", user!.id)
        .gte("created_at", today);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: weekRevenue = 0 } = useQuery({
    queryKey: ["vendor-dash-revenue", user?.id],
    queryFn: async () => {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data } = await supabase
        .from("orders")
        .select("total")
        .eq("vendor_id", user!.id)
        .eq("status", "delivered")
        .gte("created_at", weekAgo);
      return data?.reduce((s, o) => s + Number(o.total), 0) || 0;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Products Listed", value: String(productCount), icon: Store },
    { label: "Orders Today", value: String(todayOrders), icon: Package },
    { label: "Revenue (Week)", value: `₹${weekRevenue.toFixed(0)}`, icon: TrendingUp },
  ];

  const quickLinks = [
    { to: "/vendor/products", label: "Manage Products", icon: ShoppingCart, desc: "Add, edit, or remove products" },
    { to: "/vendor/stock", label: "Daily Stock Update", icon: ClipboardCheck, desc: "Update today's available quantities" },
    { to: "/vendor/orders", label: "View Orders", icon: Package, desc: "Accept or reject incoming orders" },
    { to: "/vendor/sales", label: "Sales Summary", icon: BarChart3, desc: "Track revenue and analytics" },
  ];

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || "Vendor"}. Manage your shop here.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-display font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <Link to={link.to}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-muted-foreground">{link.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default VendorDashboard;
