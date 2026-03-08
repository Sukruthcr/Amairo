import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bike } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const AdminRiders = () => {
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["admin-riders"],
    queryFn: async () => {
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "rider");
      if (rolesErr) throw rolesErr;
      if (!roles.length) return [];

      const riderIds = roles.map((r) => r.user_id);
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", riderIds);
      if (profErr) throw profErr;

      // Get delivery counts
      const { data: orders } = await supabase
        .from("orders")
        .select("rider_id")
        .in("rider_id", riderIds)
        .eq("status", "delivered");

      const countMap: Record<string, number> = {};
      orders?.forEach((o) => { if (o.rider_id) countMap[o.rider_id] = (countMap[o.rider_id] || 0) + 1; });

      return profiles.map((p) => ({ ...p, delivery_count: countMap[p.user_id] || 0 }));
    },
  });

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Riders</h1>
          <p className="text-muted-foreground">View registered riders and their delivery stats.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : riders.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-10">No riders registered yet</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {riders.map((r: any, i: number) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="pt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Bike className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{r.full_name || "Unnamed Rider"}</h3>
                        <p className="text-xs text-muted-foreground">{r.phone || "No phone"}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{r.delivery_count} deliveries</Badge>
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

export default AdminRiders;
