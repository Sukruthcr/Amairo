import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Bike, Package, MapPin } from "lucide-react";

const RiderDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Rider Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || "Rider"}. Your deliveries at a glance.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Deliveries Today", value: "5", icon: Package },
            { label: "Earnings Today", value: "₹650", icon: Bike },
            { label: "Active Delivery", value: "1", icon: MapPin },
          ].map((s, i) => (
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

        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Bike className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">GPS navigation, delivery assignments, and status updates coming soon.</p>
            <p className="text-sm mt-2">This dashboard will be fully functional in the next phase.</p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default RiderDashboard;
