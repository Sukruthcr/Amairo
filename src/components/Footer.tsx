import { Link } from "react-router-dom";
import { Truck, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-display text-lg font-bold mb-4">
              <Truck className="h-5 w-5" />
              Amairo
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Connecting vendors, customers, and riders in one seamless delivery ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-60">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/stats", label: "Statistics" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Join Us */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-60">Join Us</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <span>Become a Vendor</span>
              <span>Become a Rider</span>
              <span>Order as Customer</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider opacity-60">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                hello@smartdeliveryhub.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                India
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm opacity-50">
          © {new Date().getFullYear()} Smart Delivery Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
