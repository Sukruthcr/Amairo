import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, MapPin, CheckCircle, Truck } from "lucide-react";
import { useEffect } from "react";

const statusFlow: Record<string, { next: string; label: string; icon: any }> = {
  dispatched: { next: "picked_up", label: "Mark Picked Up", icon: Package },
  picked_up: { next: "delivered", label: "Mark Delivered", icon: CheckCircle },
};

const RiderDeliveries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["rider-deliveries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, unit))")
        .eq("rider_id", user!.id)
        .in("status", ["dispatched", "picked_up", "delivered"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("rider-deliveries-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `rider_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["rider-deliveries"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["rider-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["rider-dash"] });
      toast({ title: `Order ${status.replace("_", " ")}` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const active = deliveries.filter((d: any) => d.status !== "delivered");
  const completed = deliveries.filter((d: any) => d.status === "delivered");

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Deliveries</h1>
          <p className="text-muted-foreground">Manage your active and completed deliveries</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" /></div>
        ) : deliveries.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-16">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No deliveries assigned yet</p>
              <p className="text-sm mt-1">New delivery assignments will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {active.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-secondary" /> Active ({active.length})
                </h2>
                <div className="space-y-3">
                  {active.map((o: any) => {
                    const action = statusFlow[o.status];
                    return (
                      <Card key={o.id} className="border-secondary/30">
                        <CardContent className="pt-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                                <Badge variant="default">{o.status.replace("_", " ")}</Badge>
                              </div>
                              <div className="text-sm space-y-0.5 mb-2">
                                {o.order_items?.map((item: any) => (
                                  <div key={item.id}>{item.products?.name} × {item.quantity} {item.products?.unit}</div>
                                ))}
                              </div>
                              {o.delivery_address && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {o.delivery_address}
                                </p>
                              )}
                              <p className="font-medium mt-2">₹{Number(o.total).toFixed(2)}</p>
                            </div>
                            {action && (
                              <Button size="sm" className="gap-1 shrink-0" onClick={() => updateStatus.mutate({ id: o.id, status: action.next })}>
                                <action.icon className="h-3.5 w-3.5" /> {action.label}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {completed.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" /> Completed ({completed.length})
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Earning</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completed.map((o: any) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}...</TableCell>
                            <TableCell className="text-sm">
                              {o.order_items?.map((i: any) => i.products?.name).join(", ")}
                            </TableCell>
                            <TableCell>₹{Number(o.total).toFixed(2)}</TableCell>
                            <TableCell className="text-primary font-medium">₹{(Number(o.total) * 0.1).toFixed(2)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default RiderDeliveries;
