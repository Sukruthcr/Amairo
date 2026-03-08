import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Bike, Package, MapPin, IndianRupee, ClipboardList, BarChart3 } from "lucide-react";

const RiderDashboard = () => {
  const { user } = useAuth();

  const { data: todayDeliveries = 0 } = useQuery({
    queryKey: ["rider-dash-deliveries", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("rider_id", user!.id)
        .eq("status", "delivered")
        .gte("created_at", today);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: activeDeliveries = 0 } = useQuery({
    queryKey: ["rider-dash-active", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("rider_id", user!.id)
        .in("status", ["dispatched", "picked_up"]);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: todayEarnings = 0 } = useQuery({
    queryKey: ["rider-dash-earnings", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("orders")
        .select("total")
        .eq("rider_id", user!.id)
        .eq("status", "delivered")
        .gte("created_at", today);
      // Rider earns 10% of order total
      return data?.reduce((s, o) => s + Number(o.total) * 0.1, 0) || 0;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Deliveries Today", value: String(todayDeliveries), icon: Package },
    { label: "Earnings Today", value: `₹${todayEarnings.toFixed(0)}`, icon: IndianRupee },
    { label: "Active Deliveries", value: String(activeDeliveries), icon: MapPin },
  ];

  const quickLinks = [
    { to: "/rider/deliveries", label: "My Deliveries", icon: ClipboardList, desc: "View assigned & active deliveries" },
    { to: "/rider/earnings", label: "Earnings Summary", icon: BarChart3, desc: "Track your earnings & history" },
  ];

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Rider Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || "Rider"}. Your deliveries at a glance.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <s.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
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
                <Card className="hover:border-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <link.icon className="h-5 w-5 text-secondary" />
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

export default RiderDashboard;
