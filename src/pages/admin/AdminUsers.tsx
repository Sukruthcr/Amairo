import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Priya S.", email: "priya@email.com", role: "customer" },
  { id: 2, name: "Gayatri Shop", email: "gayatri@shop.com", role: "vendor" },
  { id: 3, name: "Amit Kumar", email: "amit@rider.com", role: "rider" },
  { id: 4, name: "Admin User", email: "admin@sdh.com", role: "admin" },
  { id: 5, name: "Rahul Singh", email: "rahul@rider.com", role: "rider" },
];

const roleColors: Record<string, string> = {
  admin: "destructive",
  vendor: "default",
  rider: "secondary",
  customer: "outline",
};

const AdminUsers = () => {
  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">View all registered users and their roles.</p>
        </motion.div>

        <div className="space-y-4">
          {mockUsers.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{u.name}</h3>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant={roleColors[u.role] as any}>{u.role}</Badge>
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

export default AdminUsers;
