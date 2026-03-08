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
import { Search, ShoppingCart, ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
