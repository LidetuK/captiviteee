import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Code,
  Terminal,
  Database,
  Webhook,
  Settings,
  FileCode,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/CAPTIVITE-X">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary cursor-pointer">
                Captivite
              </h3>
            </Link>
            <p className="text-muted-foreground">
              Transforming businesses through intelligent automation and
              AI-powered solutions.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/CAPTIVITE-X/about" },
                { name: "Features", path: "/CAPTIVITE-X/features" },
                { name: "Pricing", path: "/CAPTIVITE-X/pricing" },
                { name: "Blog", path: "/CAPTIVITE-X/blog" },
                { name: "Contact", path: "/CAPTIVITE-X/contact" },
                { name: "Login", path: "/login" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2">
              {[
                { name: "Documentation", path: "/CAPTIVITE-X/docs" },
                { name: "Support", path: "/CAPTIVITE-X/help" },
                { name: "API", path: "/CAPTIVITE-X/api-docs" },
                { name: "Privacy Policy", path: "/CAPTIVITE-X/privacy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Portal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Developer Portal</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/api-explorer">
                  <Code className="mr-2 h-4 w-4" />
                  API Explorer
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/database-explorer">
                  <Database className="mr-2 h-4 w-4" />
                  Database Explorer
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/webhooks">
                  <Webhook className="mr-2 h-4 w-4" />
                  Webhooks
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/terminal">
                  <Terminal className="mr-2 h-4 w-4" />
                  Console
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/api-docs">
                  <FileCode className="mr-2 h-4 w-4" />
                  API Docs
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/CAPTIVITE-X/dev-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Developer Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Captivite. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/CAPTIVITE-X/terms" className="hover:text-primary">
                Terms
              </Link>
              <Link to="/CAPTIVITE-X/privacy" className="hover:text-primary">
                Privacy
              </Link>
              <Link to="/CAPTIVITE-X/cookies" className="hover:text-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
