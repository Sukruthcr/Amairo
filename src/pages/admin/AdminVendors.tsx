import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Store, Check, X } from "lucide-react";

const mockVendors = [
  { id: 1, name: "Gayatri Electronics", email: "gayatri@shop.com", phone: "+91 99876 54321", status: "pending", products: 24 },
  { id: 2, name: "Fresh Mart", email: "freshmart@shop.com", phone: "+91 98765 12345", status: "approved", products: 56 },
  { id: 3, name: "Daily Needs Store", email: "daily@shop.com", phone: "+91 91234 56789", status: "approved", products: 38 },
  { id: 4, name: "Kirana King", email: "kirana@shop.com", phone: "+91 87654 32100", status: "pending", products: 12 },
];

const AdminVendors = () => {
  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Vendors</h1>
          <p className="text-muted-foreground">Review, approve, and manage vendor accounts.</p>
        </motion.div>

        <div className="space-y-4">
          {mockVendors.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{v.name}</h3>
                        <p className="text-sm text-muted-foreground">{v.email} • {v.phone}</p>
                        <p className="text-xs text-muted-foreground mt-1">{v.products} products listed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={v.status === "approved" ? "default" : "secondary"}>
                        {v.status}
                      </Badge>
                      {v.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-1"><Check className="h-3.5 w-3.5" /> Approve</Button>
                          <Button size="sm" variant="destructive" className="gap-1"><X className="h-3.5 w-3.5" /> Reject</Button>
                        </div>
                      )}
                    </div>
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

export default AdminVendors;
