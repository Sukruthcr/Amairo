import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const statusSteps = ["pending", "accepted", "preparing", "dispatched", "picked_up", "delivered"];
const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  dispatched: "Dispatched",
  picked_up: "Picked Up",
  delivered: "Delivered",
  rejected: "Rejected",
};

const CustomerOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, unit))")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("customer-orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const getProgress = (status: string) => {
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? ((idx + 1) / statusSteps.length) * 100 : 0;
  };

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your orders in real-time</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : orders.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-16">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm mt-1">Start shopping to place your first order</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any, i: number) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(o.created_at).toLocaleDateString()} {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={o.status === "delivered" ? "default" : o.status === "rejected" ? "destructive" : "secondary"}>
                        {statusLabels[o.status] || o.status}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    {o.status !== "rejected" && (
                      <div className="mb-3">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${getProgress(o.status)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          {statusSteps.map((s) => (
                            <span key={s} className={`text-[9px] ${statusSteps.indexOf(o.status) >= statusSteps.indexOf(s) ? "text-primary font-medium" : "text-muted-foreground"}`}>
                              {statusLabels[s]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-sm space-y-0.5">
                      {o.order_items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.products?.name} × {item.quantity}</span>
                          <span className="text-muted-foreground">₹{(Number(item.price) * Number(item.quantity)).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      {o.delivery_address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[60%]">
                          <MapPin className="h-3 w-3 shrink-0" /> {o.delivery_address}
                        </p>
                      )}
                      <p className="font-display font-bold">₹{Number(o.total).toFixed(0)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CustomerOrders;
