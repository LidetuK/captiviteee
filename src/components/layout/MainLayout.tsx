import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Users,
  MessageSquare,
  Phone,
  Bot,
  LineChart,
  Star,
  Calendar,
  Receipt,
  Bell,
  Building,
  Link2,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const SidebarSection = ({ title }: { title: string }) => {
  return (
    <div className="px-3 py-2">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background overflow-y-auto" style={{maxHeight: '100vh'}}>
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/dashboard" className="text-xl font-bold text-primary">
            Captivite
          </Link>
        </div>

        <div className="space-y-4 py-4">
          <SidebarSection title="OVERVIEW" />
          <div className="px-3 py-1">
            <div className="space-y-1">
              <SidebarItem
                icon={<Home className="h-4 w-4" />}
                label="Dashboard"
                href="/dashboard"
                active={currentPath === "/dashboard"}
              />
              <SidebarItem
                icon={<BarChart className="h-4 w-4" />}
                label="Analytics"
                href="/analytics"
                active={currentPath === "/analytics"}
              />
              <SidebarItem
                icon={<Users className="h-4 w-4" />}
                label="Customers"
                href="/customers"
                active={currentPath === "/customers"}
              />
              <SidebarItem
                icon={<MessageSquare className="h-4 w-4" />}
                label="Messages"
                href="/messages"
                active={currentPath === "/messages"}
              />
            </div>
          </div>

          <SidebarSection title="AI FEATURES" />
          <div className="px-3 py-1">
            <div className="space-y-1">
              <SidebarItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone Agent"
                href="/phone-agent"
                active={currentPath === "/phone-agent"}
              />
              <SidebarItem
                icon={<Bot className="h-4 w-4" />}
                label="AI Assistant"
                href="/ai-assistant"
                active={currentPath === "/ai-assistant"}
              />
              <SidebarItem
                icon={<LineChart className="h-4 w-4" />}
                label="Smart Analytics"
                href="/smart-analytics"
                active={currentPath === "/smart-analytics"}
              />
              <SidebarItem
                icon={<Star className="h-4 w-4" />}
                label="Reputation"
                href="/reputation"
                active={currentPath.includes("/reputation")}
              />
            </div>
          </div>

          <SidebarSection title="BUSINESS" />
          <div className="px-3 py-1">
            <div className="space-y-1">
              <SidebarItem
                icon={<Calendar className="h-4 w-4" />}
                label="Appointments"
                href="/appointments"
                active={currentPath === "/appointments"}
              />
              <SidebarItem
                icon={<Receipt className="h-4 w-4" />}
                label="Billing"
                href="/billing"
                active={currentPath === "/billing"}
              />
              <SidebarItem
                icon={<Bell className="h-4 w-4" />}
                label="Notifications"
                href="/notifications"
                active={currentPath === "/notifications"}
              />
              <SidebarItem
                icon={<Building className="h-4 w-4" />}
                label="Organization"
                href="/organization"
                active={currentPath === "/organization"}
              />
              <SidebarItem
                icon={<Link2 className="h-4 w-4" />}
                label="Integrations"
                href="/integrations"
                active={currentPath === "/integrations"}
              />
            </div>
          </div>

          <div className="mt-auto px-3 py-1">
            <div className="space-y-1">
              <SidebarItem
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                href="/settings"
                active={currentPath === "/settings"}
              />
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10 text-muted-foreground w-full",
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
