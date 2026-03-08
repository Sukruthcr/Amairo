import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const mockOrders = [
  { id: "ORD-001", customer: "Priya S.", vendor: "Gayatri Electronics", rider: "Amit Kumar", total: "₹2,499", status: "delivered" },
  { id: "ORD-002", customer: "Rahul M.", vendor: "Fresh Mart", rider: "Suresh P.", total: "₹350", status: "on_the_way" },
  { id: "ORD-003", customer: "Neha K.", vendor: "Daily Needs Store", rider: "Deepak M.", total: "₹1,200", status: "picked_up" },
  { id: "ORD-004", customer: "Vikram T.", vendor: "Kirana King", rider: "—", total: "₹780", status: "pending" },
  { id: "ORD-005", customer: "Anita R.", vendor: "Fresh Mart", rider: "Rahul Singh", total: "₹540", status: "delivered" },
];

const statusColors: Record<string, string> = {
  pending: "secondary",
  picked_up: "default",
  on_the_way: "default",
  delivered: "default",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  on_the_way: "On the Way",
  delivered: "Delivered",
};

const AdminOrders = () => {
  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">Monitor all orders across the platform.</p>
        </motion.div>

        <div className="space-y-4">
          {mockOrders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{o.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {o.customer} → {o.vendor}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Rider: {o.rider} • Total: {o.total}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusColors[o.status] as "default" | "secondary"}>
                      {statusLabels[o.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default AdminOrders;
