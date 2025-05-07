import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Phone,
  Bot,
  Star,
  FileText,
  HelpCircle,
  Code,
  Boxes,
  Gauge,
  BrainCircuit,
  Building2,
  Wallet,
  Bell,
  Database,
  Terminal,
  Webhook,
  Layers,
  CreditCard,
  LineChart,
  PieChart,
  BarChart2,
} from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

interface NavigationItem {
  title: string;
  items: {
    name: string;
    icon: React.ReactNode;
    path: string;
  }[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: <Gauge className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard",
      },
      {
        name: "Analytics",
        icon: <BarChart className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/analytics",
      },
      {
        name: "Customers",
        icon: <Users className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/customers",
      },
      {
        name: "Messages",
        icon: <MessageSquare className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/messages",
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        name: "Phone Agent",
        icon: <Phone className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/phone-agent",
      },
      {
        name: "AI Assistant",
        icon: <Bot className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/ai-assistant",
      },
      {
        name: "Smart Analytics",
        icon: <BrainCircuit className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/smart-analytics",
      },
      {
        name: "Reputation",
        icon: <Star className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/reputation",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        name: "Appointments",
        icon: <Calendar className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/appointments",
      },
      {
        name: "Billing",
        icon: <Wallet className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/billing",
      },
      {
        name: "Notifications",
        icon: <Bell className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/notifications",
      },
      {
        name: "Organization",
        icon: <Building2 className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/organization",
      },
      {
        name: "Integrations",
        icon: <Boxes className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/dashboard/integrations",
      },
    ],
  },
  {
    title: "Developer",
    items: [
      {
        name: "API Explorer",
        icon: <Code className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/api-explorer",
      },
      {
        name: "Database Explorer",
        icon: <Database className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/database-explorer",
      },
      {
        name: "Webhooks",
        icon: <Webhook className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/webhooks",
      },
      {
        name: "Terminal",
        icon: <Terminal className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/terminal",
      },
      {
        name: "Documentation",
        icon: <FileText className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/docs",
      },
      {
        name: "Support",
        icon: <HelpCircle className="mr-2 h-5 w-5" />,
        path: "/CAPTIVITE-X/help",
      },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    try {
      setIsLoading(true);
      setError(null);
      navigate(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <Link to="/CAPTIVITE-X/dashboard" className="block">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                Captivite
              </h2>
            </Link>
          </div>

          <nav className="space-y-8 flex-1 overflow-y-auto pr-2">
            {navigationItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-3 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActiveRoute(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={item.path}>
                        {item.icon}
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="pt-6 mt-auto border-t space-y-3">
            <Button
              variant={
                isActiveRoute("/CAPTIVITE-X/dashboard/settings")
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              asChild
            >
              <Link to="/CAPTIVITE-X/dashboard/settings">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => navigate("/CAPTIVITE-X/login")}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {error && (
          <div className="p-4 bg-red-100 text-red-700">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="p-8">
              <Breadcrumb />
              {children}
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
