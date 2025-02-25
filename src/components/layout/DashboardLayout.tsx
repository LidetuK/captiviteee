import React from "react";
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
} from "lucide-react";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: <Gauge className="mr-2 h-5 w-5" />,
        path: "/dashboard",
      },
      {
        name: "Analytics",
        icon: <BarChart className="mr-2 h-5 w-5" />,
        path: "/dashboard/analytics",
      },
      {
        name: "Customers",
        icon: <Users className="mr-2 h-5 w-5" />,
        path: "/dashboard/customers",
      },
      {
        name: "Messages",
        icon: <MessageSquare className="mr-2 h-5 w-5" />,
        path: "/dashboard/messages",
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        name: "Phone Agent",
        icon: <Phone className="mr-2 h-5 w-5" />,
        path: "/phone-agent",
      },
      {
        name: "AI Assistant",
        icon: <Bot className="mr-2 h-5 w-5" />,
        path: "/dashboard/ai-assistant",
      },
      {
        name: "Smart Analytics",
        icon: <BrainCircuit className="mr-2 h-5 w-5" />,
        path: "/dashboard/smart-analytics",
      },
      {
        name: "Reputation",
        icon: <Star className="mr-2 h-5 w-5" />,
        path: "/dashboard/reputation",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        name: "Appointments",
        icon: <Calendar className="mr-2 h-5 w-5" />,
        path: "/dashboard/appointments",
      },
      {
        name: "Billing",
        icon: <Wallet className="mr-2 h-5 w-5" />,
        path: "/dashboard/billing",
      },
      {
        name: "Notifications",
        icon: <Bell className="mr-2 h-5 w-5" />,
        path: "/dashboard/notifications",
      },
      {
        name: "Organization",
        icon: <Building2 className="mr-2 h-5 w-5" />,
        path: "/dashboard/organization",
      },
    ],
  },
  {
    title: "Developer",
    items: [
      {
        name: "API Explorer",
        icon: <Code className="mr-2 h-5 w-5" />,
        path: "/api-explorer",
      },
      {
        name: "Documentation",
        icon: <FileText className="mr-2 h-5 w-5" />,
        path: "/docs",
      },
      {
        name: "Integrations",
        icon: <Boxes className="mr-2 h-5 w-5" />,
        path: "/dashboard/integrations",
      },
      {
        name: "Support",
        icon: <HelpCircle className="mr-2 h-5 w-5" />,
        path: "/help",
      },
    ],
  },
];

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r p-4 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>

          <nav className="space-y-6 flex-1">
            {navigationItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.path}
                      variant={
                        location.pathname === item.path ? "secondary" : "ghost"
                      }
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

          <div className="pt-6 mt-auto border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => navigate("/login")}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Breadcrumb />
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
