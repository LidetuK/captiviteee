import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PrivateRoute } from "@/lib/auth";
import { PageTransition } from "@/components/ui/page-transition";
import { useLoading } from "@/lib/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Home from "./components/home";
import MainLayout from "./components/layout/MainLayout";
import TempoRoutes from "./components/TempoRoutes";
import LoginPage from "./pages/auth/login";
import DashboardLayout from "./components/layout/DashboardLayout";

// Dashboard Pages
import DashboardPage from "./pages/dashboard";
import AnalyticsPage from "./pages/dashboard/analytics";
import CustomersPage from "./pages/dashboard/customers";
import AppointmentsPage from "./pages/dashboard/appointments";
import MessagesPage from "./pages/dashboard/messages";
import SettingsPage from "./pages/dashboard/settings";
import BillingPage from "./pages/dashboard/billing";
import SmartAnalyticsPage from "./pages/dashboard/smart-analytics";
import NotificationsPage from "./pages/dashboard/notifications";
import OrganizationPage from "./pages/dashboard/organization";
import IntegrationsPage from "./pages/dashboard/integrations";

// Feature Pages
import PhoneAgentPage from "./pages/phone-agent";
import AIAssistantPage from "./pages/features/ai-assistant";
import ReputationPage from "./pages/features/reputation";

// Developer Pages
import APIExplorer from "./pages/developer/api-explorer";
import DatabaseExplorer from "./pages/developer/database-explorer";
import WebhooksPage from "./pages/developer/webhooks";
import TerminalPage from "./pages/developer/terminal";
import DeveloperSettings from "./pages/developer/settings";
import DocsPage from "./pages/resources/docs";
import HelpPage from "./pages/resources/help";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboardRoute = [
    "/dashboard",
    "/phone-agent",
    "/api-explorer",
    "/docs",
    "/help",
  ].some((path) => location.pathname.startsWith(path));

  if (location.pathname === "/login") {
    return children;
  }

  if (isDashboardRoute) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  const isLoading = useLoading((state) => state.isLoading);

  return (
    <Router>
      <ErrorBoundary>
        <AppLayout>
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO && <TempoRoutes />}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/customers" element={<CustomersPage />} />
              <Route
                path="/dashboard/appointments"
                element={<AppointmentsPage />}
              />
              <Route path="/dashboard/messages" element={<MessagesPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/billing" element={<BillingPage />} />
              <Route
                path="/dashboard/smart-analytics"
                element={<SmartAnalyticsPage />}
              />
              <Route
                path="/dashboard/ai-assistant"
                element={<AIAssistantPage />}
              />
              <Route
                path="/dashboard/reputation"
                element={<ReputationPage />}
              />
              <Route
                path="/dashboard/notifications"
                element={<NotificationsPage />}
              />
              <Route
                path="/dashboard/organization"
                element={<OrganizationPage />}
              />
              <Route
                path="/dashboard/integrations"
                element={<IntegrationsPage />}
              />

              {/* Feature Routes */}
              <Route path="/phone-agent" element={<PhoneAgentPage />} />

              {/* Developer Routes */}
              <Route path="/api-explorer" element={<APIExplorer />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/database-explorer" element={<DatabaseExplorer />} />
              <Route path="/webhooks" element={<WebhooksPage />} />
              <Route path="/terminal" element={<TerminalPage />} />
              <Route path="/dev-settings" element={<DeveloperSettings />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppLayout>
      </ErrorBoundary>
    </Router>
  );
}
