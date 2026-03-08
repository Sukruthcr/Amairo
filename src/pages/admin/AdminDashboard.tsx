import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Store, Bike, Package, ShieldCheck, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const adminCards = [
  {
    title: "Manage Vendors",
    desc: "Approve, view, and manage vendor accounts and their products.",
    icon: Store,
    to: "/admin/vendors",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Manage Riders",
    desc: "Approve rider registrations, view vehicle and licence details.",
    icon: Bike,
    to: "/admin/riders",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Orders",
    desc: "Monitor all orders, track delivery status, handle issues.",
    icon: Package,
    to: "/admin/orders",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Users",
    desc: "View all registered users and manage roles.",
    icon: Users,
    to: "/admin/users",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Photo Approval",
    desc: "Review and approve/replace vendor product photos.",
    icon: ShieldCheck,
    to: "/admin",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Analytics",
    desc: "View performance charts and business metrics.",
    icon: BarChart3,
    to: "/stats",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <section className="container py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || "Admin"}. Manage your platform from here.</p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Vendors", value: "500+", icon: Store },
            { label: "Total Riders", value: "450+", icon: Bike },
            { label: "Active Orders", value: "128", icon: Package },
            { label: "Total Users", value: "10,500+", icon: Users },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-display font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
              <Link to={card.to}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
