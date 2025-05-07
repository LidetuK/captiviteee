import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Phone,
  Bot,
  Brain,
  Star,
  Calendar,
  CreditCard,
  Bell,
  Building2,
  Boxes,
  Globe,
  Sparkles,
  Headphones,
  FileText,
  Mail,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    // OVERVIEW section
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      section: "OVERVIEW",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      section: "OVERVIEW",
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <Users className="h-4 w-4" />,
      section: "OVERVIEW",
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <MessageSquare className="h-4 w-4" />,
      section: "OVERVIEW",
    },

    // AI FEATURES section
    {
      name: "Phone Agent",
      path: "/phone-agent",
      icon: <Phone className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "AI Assistant",
      path: "/ai-assistant",
      icon: <Bot className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Smart Analytics",
      path: "/smart-analytics",
      icon: <Brain className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Reputation",
      path: "/reputation",
      icon: <Star className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Social Media",
      path: "/social-media",
      icon: <Globe className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Content Generator",
      path: "/content-generator",
      icon: <Sparkles className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Customer Support",
      path: "/customer-support",
      icon: <Headphones className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Document Analysis",
      path: "/document-analysis",
      icon: <FileText className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Email Automation",
      path: "/email-automation",
      icon: <Mail className="h-4 w-4" />,
      section: "AI FEATURES",
    },
    {
      name: "Lead Generation",
      path: "/lead-generation",
      icon: <Zap className="h-4 w-4" />,
      section: "AI FEATURES",
    },

    // BUSINESS section
    {
      name: "Appointments",
      path: "/appointments",
      icon: <Calendar className="h-4 w-4" />,
      section: "BUSINESS",
    },
    {
      name: "Billing",
      path: "/billing",
      icon: <CreditCard className="h-4 w-4" />,
      section: "BUSINESS",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell className="h-4 w-4" />,
      section: "BUSINESS",
    },
    {
      name: "Organization",
      path: "/organization",
      icon: <Building2 className="h-4 w-4" />,
      section: "BUSINESS",
    },
    {
      name: "Integrations",
      path: "/integrations",
      icon: <Boxes className="h-4 w-4" />,
      section: "BUSINESS",
    },

    // Settings at the bottom
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-4 w-4" />,
      section: "SETTINGS",
    },
  ];

  return (
    <div className="min-h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-600">Captivite</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Group items by section */}
        {["OVERVIEW", "AI FEATURES", "BUSINESS"].map((section) => (
          <div key={section} className="mb-6 px-4">
            <h2 className="text-xs font-medium text-gray-500 mb-2">
              {section}
            </h2>
            <ul className="space-y-1">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center py-2 px-3 rounded-md ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
                      }
                    >
                      {item.icon}
                      <span className="ml-3 text-sm">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {/* Settings section */}
        <div className="px-4">
          <ul className="space-y-1">
            {navItems
              .filter((item) => item.section === "SETTINGS")
              .map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 rounded-md ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`
                    }
                  >
                    {item.icon}
                    <span className="ml-3 text-sm">{item.name}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900 py-2 px-3"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
