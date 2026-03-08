import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const roleColors: Record<string, string> = {
  admin: "destructive",
  vendor: "default",
  rider: "secondary",
  customer: "outline",
};

const AdminUsers = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profErr) throw profErr;

      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rolesErr) throw rolesErr;

      const roleMap: Record<string, string> = {};
      roles.forEach((r) => { roleMap[r.user_id] = r.role; });

      return profiles.map((p) => ({ ...p, role: roleMap[p.user_id] || "customer" }));
    },
  });

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">View all registered users ({users.length}) and their roles.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : users.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-10">No users yet</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {users.map((u: any, i: number) => (
              <motion.div key={u.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardContent className="pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{u.full_name || "Unnamed"}</h3>
                        <p className="text-xs text-muted-foreground">{u.phone || "No phone"} • Joined {new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant={roleColors[u.role] as any}>{u.role}</Badge>
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

export default AdminUsers;
