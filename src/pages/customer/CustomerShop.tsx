import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, ShoppingCart, ImageIcon, Plus, Package, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  dispatched: "Dispatched",
  picked_up: "Picked Up",
  delivered: "Delivered",
  rejected: "Rejected",
};

const CustomerShop = () => {
  const { user } = useAuth();
  const { addItem, itemCount } = useCart();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["recent-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, created_at, delivery_address")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">Browse products from local vendors</p>
          </div>
          <Link to="/customer/cart">
            <Button variant="outline" className="gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">{itemCount}</Badge>
              )}
            </Button>
          </Link>
        </motion.div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Recent Orders
              </h2>
              <Link to="/customer/orders" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentOrders.map((o: any) => (
                <Link key={o.id} to="/customer/orders">
                  <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                        <Badge variant={o.status === "delivered" ? "default" : o.status === "rejected" ? "destructive" : "secondary"} className="text-[10px]">
                          {statusLabels[o.status] || o.status}
                        </Badge>
                      </div>
                      <p className="font-display font-bold">₹{Number(o.total).toFixed(0)}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(o.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            maxLength={100}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-16">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No products found</p>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">per {p.unit}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-display font-bold text-lg">₹{Number(p.price).toFixed(0)}</span>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          addItem({
                            product_id: p.id,
                            vendor_id: p.vendor_id,
                            name: p.name,
                            price: Number(p.price),
                            unit: p.unit,
                            photo_url: p.photo_url,
                          });
                          toast({ title: `${p.name} added to cart` });
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
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

export default CustomerShop;
