import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bike, Check, X } from "lucide-react";

const mockRiders = [
  { id: 1, name: "Amit Kumar", email: "amit@rider.com", vehicle: "Honda Activa (EV)", licence: "DL-12345678", status: "pending" },
  { id: 2, name: "Rahul Singh", email: "rahul@rider.com", vehicle: "Ola S1 Pro", licence: "MH-98765432", status: "approved" },
  { id: 3, name: "Suresh P.", email: "suresh@rider.com", vehicle: "TVS iQube", licence: "KA-55667788", status: "approved" },
  { id: 4, name: "Deepak M.", email: "deepak@rider.com", vehicle: "Bajaj Chetak", licence: "TN-11223344", status: "pending" },
];

const AdminRiders = () => {
  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Riders</h1>
          <p className="text-muted-foreground">Review rider registrations, vehicle details, and licences.</p>
        </motion.div>

        <div className="space-y-4">
          {mockRiders.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Bike className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">🏍 {r.vehicle} • Licence: {r.licence}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={r.status === "approved" ? "default" : "secondary"}>
                        {r.status}
                      </Badge>
                      {r.status === "pending" && (
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

export default AdminRiders;
