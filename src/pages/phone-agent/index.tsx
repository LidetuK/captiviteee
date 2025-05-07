import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentBuilder from "@/components/phone-agent/AgentBuilder";
import CallMonitor from "@/components/phone-agent/CallMonitor";
import Analytics from "@/components/phone-agent/Analytics";
import { Bot, Phone, BarChart } from "lucide-react";

const PhoneAgentPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Phone Agent Platform</h1>

      <Tabs defaultValue="builder" className="space-y-8">
        <TabsList className="w-full">
          <TabsTrigger value="builder" className="flex-1">
            <Bot className="mr-2 h-4 w-4" /> Agent Builder
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex-1">
            <Phone className="mr-2 h-4 w-4" /> Live Monitor
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">
            <BarChart className="mr-2 h-4 w-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <AgentBuilder />
        </TabsContent>

        <TabsContent value="monitor">
          <CallMonitor />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhoneAgentPage;
