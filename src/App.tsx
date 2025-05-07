import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AboutUs from "./components/landing/AboutUs";
import FeaturesPage from "./components/landing/FeaturesPage";
import DocsPage from "./components/landing/DocsPage";
import HelpPage from "./components/landing/HelpPage";
import ApiDocsPage from "./components/landing/ApiDocsPage";
import PrivacyPage from "./components/landing/PrivacyPage";
import LoginPage from "./components/auth/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/dashboard/Dashboard";
import AnalyticsPage from "./pages/dashboard/analytics";
import CustomersPage from "./pages/dashboard/customers";
import MessagesPage from "./pages/dashboard/messages";
import PhoneAgentPage from "./pages/phone-agent/index";
import AIAssistantPanel from "./components/dashboard/AIAssistantPanel";
import SmartAnalyticsPage from "./pages/dashboard/smart-analytics";
import ReputationPage from "./pages/ReputationPage";
import AppointmentsPage from "./pages/dashboard/appointments";
import BillingPage from "./pages/dashboard/billing";
import SocialMediaDashboard from "./components/social-media/SocialMediaDashboard";
import NotificationsPage from "./pages/dashboard/notifications";
import OrganizationPage from "./pages/dashboard/organization";
import IntegrationsPage from "./pages/dashboard/integrations";
import SettingsPage from "./pages/dashboard/settings";
import TextBackPage from "./pages/features/text-back";
import SchedulingPage from "./pages/features/scheduling";
import ReputationFeaturePage from "./pages/features/reputation";
import AnalyticsFeaturePage from "./pages/features/analytics";
import AIAssistantFeaturePage from "./pages/features/ai-assistant";
import IntegrationsFeaturePage from "./pages/features/integrations";
import HealthcarePage from "./pages/solutions/healthcare";
import RetailPage from "./pages/solutions/retail";
import ProfessionalServicesPage from "./pages/solutions/professional-services";
import HospitalityPage from "./pages/solutions/hospitality";
import RealEstatePage from "./pages/solutions/real-estate";
import ContentPage from "./pages/resources/content";
import CaseStudiesPage from "./pages/resources/case-studies";
import CommunityPage from "./pages/resources/community";
import ResourceBlogPage from "./pages/resources/blog";
import PartnersPage from "./pages/resources/partners";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/features/text-back" element={<TextBackPage />} />
        <Route path="/features/scheduling" element={<SchedulingPage />} />
        <Route path="/features/reputation" element={<ReputationFeaturePage />} />
        <Route path="/features/analytics" element={<AnalyticsFeaturePage />} />
        <Route path="/features/ai-assistant" element={<AIAssistantFeaturePage />} />
        <Route path="/features/integrations" element={<IntegrationsFeaturePage />} />
        <Route path="/solutions/healthcare" element={<HealthcarePage />} />
        <Route path="/solutions/retail" element={<RetailPage />} />
        <Route path="/solutions/professional-services" element={<ProfessionalServicesPage />} />
        <Route path="/solutions/hospitality" element={<HospitalityPage />} />
        <Route path="/solutions/real-estate" element={<RealEstatePage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/blog" element={<ResourceBlogPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><AnalyticsPage /></MainLayout>} />
        <Route path="/customers" element={<MainLayout><CustomersPage /></MainLayout>} />
        <Route path="/messages" element={<MainLayout><MessagesPage /></MainLayout>} />
        <Route path="/phone-agent" element={<MainLayout><PhoneAgentPage /></MainLayout>} />
        <Route path="/ai-assistant" element={<MainLayout><AIAssistantPanel /></MainLayout>} />
        <Route path="/smart-analytics" element={<MainLayout><SmartAnalyticsPage /></MainLayout>} />
        <Route path="/reputation" element={<ReputationPage />} />
        <Route path="/appointments" element={<MainLayout><AppointmentsPage /></MainLayout>} />
        <Route path="/billing" element={<MainLayout><BillingPage /></MainLayout>} />
        <Route path="/social-media" element={<MainLayout><SocialMediaDashboard /></MainLayout>} />
        <Route path="/notifications" element={<MainLayout><NotificationsPage /></MainLayout>} />
        <Route path="/organization" element={<MainLayout><OrganizationPage /></MainLayout>} />
        <Route path="/integrations" element={<MainLayout><IntegrationsPage /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
