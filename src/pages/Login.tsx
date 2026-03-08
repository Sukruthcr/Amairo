import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roles: { value: AppRole; label: string; desc: string }[] = [
  { value: "customer", label: "Customer", desc: "Browse & order products" },
  { value: "vendor", label: "Vendor", desc: "Manage your shop inventory" },
  { value: "rider", label: "Rider", desc: "Deliver orders & earn" },
];

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("customer");

  // Vendor fields
  const [shopName, setShopName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  // Rider fields
  const [dlNumber, setDlNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        // Check approval status for vendor/rider
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("approval_status")
            .eq("user_id", user.id)
            .single();

          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          if (roleData && (roleData.role === "vendor" || roleData.role === "rider") && profile?.approval_status !== "approved") {
            await supabase.auth.signOut();
            const statusMsg = profile?.approval_status === "rejected"
              ? "Your application has been rejected. Please contact support."
              : "Your account is pending admin approval. You'll be able to sign in once approved.";
            toast({ title: "Access Pending", description: statusMsg, variant: "destructive" });
            setLoading(false);
            return;
          }
        }

        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      const metadata: Record<string, string> = {
        full_name: fullName,
        role: selectedRole,
        phone,
      };
      if (selectedRole === "vendor") {
        metadata.shop_name = shopName;
        metadata.gst_number = gstNumber;
      }
      if (selectedRole === "rider") {
        metadata.dl_number = dlNumber;
        metadata.pan_number = panNumber;
        metadata.vehicle_details = vehicleDetails;
      }

      const { error } = await signUp(email, password, fullName, selectedRole, metadata);
      if (error) {
        toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      } else {
        await supabase.auth.signOut();
        const msg = (selectedRole === "vendor" || selectedRole === "rider")
          ? "Your application has been submitted! Admin will review and approve your account."
          : "You can now sign in.";
        toast({ title: "Account Created!", description: msg });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
        setShopName("");
        setGstNumber("");
        setDlNumber("");
        setPanNumber("");
        setVehicleDetails("");
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="container py-20 md:py-28 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to your account" : "Join Smart Delivery Hub"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required maxLength={15} />
                    </div>
                    <div className="space-y-2">
                      <Label>I want to join as</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setSelectedRole(r.value)}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              selectedRole === r.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/30"
                            }`}
                          >
                            <div className="font-semibold text-sm">{r.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vendor-specific fields */}
                    {selectedRole === "vendor" && (
                      <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-sm font-medium text-muted-foreground">Vendor Verification Documents</p>
                        <div className="space-y-2">
                          <Label htmlFor="shopName">Shop Name</Label>
                          <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Your shop name" required maxLength={100} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gstNumber">GST Number</Label>
                          <Input id="gstNumber" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="e.g. 29ABCDE1234F1Z5" required maxLength={15} />
                        </div>
                      </div>
                    )}

                    {/* Rider-specific fields */}
                    {selectedRole === "rider" && (
                      <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-sm font-medium text-muted-foreground">Rider Verification Documents</p>
                        <div className="space-y-2">
                          <Label htmlFor="dlNumber">Driving Licence Number</Label>
                          <Input id="dlNumber" value={dlNumber} onChange={(e) => setDlNumber(e.target.value)} placeholder="e.g. KA-0120190001234" required maxLength={20} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Card Number</Label>
                          <Input id="panNumber" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="e.g. ABCDE1234F" required maxLength={10} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleDetails">Vehicle Details</Label>
                          <Input id="vehicleDetails" value={vehicleDetails} onChange={(e) => setVehicleDetails(e.target.value)} placeholder="e.g. Honda Activa EV - KA01AB1234" required maxLength={100} />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Login;
