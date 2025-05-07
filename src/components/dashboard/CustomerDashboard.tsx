import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsPanel from "./panels/AnalyticsPanel";
import ConversationsPanel from "./panels/ConversationsPanel";
import MetricsPanel from "./panels/MetricsPanel";
import ReportsPanel from "./panels/ReportsPanel";
import SettingsPanel from "./panels/SettingsPanel";
import PredictivePanel from "./panels/PredictivePanel";
import BackendPanel from "./panels/BackendPanel";
import AIAssistantPanel from "./panels/AIAssistantPanel";
import IntegrationPanel from "./panels/IntegrationPanel";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsPanel />
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationsPanel />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsPanel />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictivePanel />
          </TabsContent>

          <TabsContent value="backend">
            <BackendPanel />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistantPanel />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
