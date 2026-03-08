import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Store, Check, X, Package, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AdminVendors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all vendor profiles
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "vendor");
      if (rolesErr) throw rolesErr;
      if (!roles.length) return [];

      const vendorIds = roles.map((r) => r.user_id);
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", vendorIds);
      if (profErr) throw profErr;

      // Get product counts per vendor
      const { data: products } = await supabase
        .from("products")
        .select("vendor_id")
        .in("vendor_id", vendorIds);

      const countMap: Record<string, number> = {};
      products?.forEach((p) => { countMap[p.vendor_id] = (countMap[p.vendor_id] || 0) + 1; });

      return profiles.map((p) => ({ ...p, product_count: countMap[p.user_id] || 0 }));
    },
  });

  // Products pending photo approval
  const { data: pendingPhotos = [] } = useQuery({
    queryKey: ["admin-pending-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("photo_approved", false)
        .not("photo_url", "is", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const approvePhoto = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").update({ photo_approved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
      toast({ title: "Photo approved" });
    },
  });

  const rejectPhoto = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").update({ photo_url: null, photo_approved: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
      toast({ title: "Photo rejected & removed" });
    },
  });

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Vendors</h1>
          <p className="text-muted-foreground">View vendor accounts and approve product photos.</p>
        </motion.div>

        {/* Vendor List */}
        <h2 className="text-lg font-semibold mb-3">Registered Vendors ({vendors.length})</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : vendors.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-10">No vendors registered yet</CardContent></Card>
        ) : (
          <div className="space-y-3 mb-10">
            {vendors.map((v: any, i: number) => (
              <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="pt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{v.full_name || "Unnamed Vendor"}</h3>
                        <p className="text-xs text-muted-foreground">{v.phone || "No phone"}</p>
                      </div>
                    </div>
                    <Badge variant="default">{v.product_count} products</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Photo Approval */}
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-secondary" /> Pending Photo Approvals ({pendingPhotos.length})
        </h2>
        {pendingPhotos.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-10">No photos pending approval</CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pendingPhotos.map((p: any) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="pt-3">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="flex-1 gap-1" onClick={() => approvePhoto.mutate(p.id)}>
                      <Check className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1 gap-1" onClick={() => rejectPhoto.mutate(p.id)}>
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default AdminVendors;
