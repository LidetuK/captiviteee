import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Settings,
  ArrowRight,
} from "lucide-react";

const IntegrationHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  // Mock integrations data
  const integrations = [
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync appointments and events with Google Calendar",
      category: "calendar",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
      status: "connected",
      lastSync: "10 minutes ago",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates in your Slack channels",
      category: "communication",
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
      status: "connected",
      lastSync: "5 minutes ago",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect with 3,000+ apps and automate workflows",
      category: "automation",
      icon: "https://cdn.worldvectorlogo.com/logos/zapier-1.svg",
      status: "connected",
      lastSync: "1 hour ago",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      category: "payment",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      status: "not-connected",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Sync contacts and automate email campaigns",
      category: "marketing",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mailchimp_logo_2019.svg/1200px-Mailchimp_logo_2019.svg.png",
      status: "not-connected",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Sync contacts, deals, and marketing data",
      category: "crm",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png",
      status: "not-connected",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync customer data with Salesforce CRM",
      category: "crm",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      status: "not-connected",
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Schedule and manage video meetings",
      category: "communication",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/1200px-Zoom_Communications_Logo.svg.png",
      status: "connected",
      lastSync: "3 hours ago",
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Track website traffic and user behavior",
      category: "analytics",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Google_Analytics_logo.svg/1200px-Google_Analytics_logo.svg.png",
      status: "connected",
      lastSync: "2 hours ago",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "Send SMS and voice notifications",
      category: "communication",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/1200px-Twilio-logo-red.svg.png",
      status: "not-connected",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Sync products, orders, and customers",
      category: "ecommerce",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/1200px-Shopify_logo_2018.svg.png",
      status: "not-connected",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync financial data and invoices",
      category: "finance",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Intuit_QuickBooks_logo.svg/1200px-Intuit_QuickBooks_logo.svg.png",
      status: "not-connected",
    },
  ];

  // Filter integrations based on search query and active tab
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeTab === "all" || integration.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const handleIntegrationClick = (integration: any) => {
    setSelectedIntegration(integration);
    setShowIntegrationDialog(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          <Check className="h-3 w-3 mr-1" /> Connected
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-gray-100 text-gray-800 border-gray-200"
      >
        <X className="h-3 w-3 mr-1" /> Not Connected
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integration Hub</h2>
          <p className="text-muted-foreground">
            Connect your favorite tools and services
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Integration
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card
                key={integration.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handleIntegrationClick(integration)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={integration.icon}
                          alt={integration.name}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {integration.status === "connected" && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Last synced: {integration.lastSync}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <RefreshCw className="h-3 w-3 mr-1" /> Sync
                      </Button>
                    </div>
                  )}
                  {integration.status === "not-connected" && (
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <ArrowRight className="h-3 w-3 mr-1" /> Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedIntegration && (
        <Dialog
          open={showIntegrationDialog}
          onOpenChange={setShowIntegrationDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={selectedIntegration.icon}
                    alt={selectedIntegration.name}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <DialogTitle>{selectedIntegration.name}</DialogTitle>
                  <DialogDescription>
                    {selectedIntegration.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedIntegration.status === "connected" ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Currently connected and syncing data
                    </p>
                  </div>
                  {getStatusBadge(selectedIntegration.status)}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Last Sync</h4>
                  <p className="text-sm">{selectedIntegration.lastSync}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Sync Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="auto-sync">Auto-sync frequency</Label>
                      <select
                        id="auto-sync"
                        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        defaultValue="15"
                      >
                        <option value="5">Every 5 minutes</option>
                        <option value="15">Every 15 minutes</option>
                        <option value="30">Every 30 minutes</option>
                        <option value="60">Every hour</option>
                        <option value="manual">Manual only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Activity</h4>
                  <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                    <div className="space-y-2">
                      <p className="text-sm">
                        • Synced 15 new calendar events (10 minutes ago)
                      </p>
                      <p className="text-sm">
                        • Updated 3 existing events (10 minutes ago)
                      </p>
                      <p className="text-sm">
                        • Synced 8 new calendar events (1 hour ago)
                      </p>
                      <p className="text-sm">
                        • Updated 2 existing events (1 hour ago)
                      </p>
                      <p className="text-sm">
                        • Synced 12 new calendar events (2 hours ago)
                      </p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Not currently connected
                    </p>
                  </div>
                  {getStatusBadge(selectedIntegration.status)}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Connection Instructions</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Click the "Connect" button below</li>
                    <li>Sign in to your {selectedIntegration.name} account</li>
                    <li>Authorize Captivite to access your data</li>
                    <li>
                      Configure sync settings after connection is established
                    </li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">What will be synced</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Basic account information</li>
                    <li>User profile data</li>
                    <li>Activity and usage statistics</li>
                    <li>Integration-specific data</li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              {selectedIntegration.status === "connected" ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowIntegrationDialog(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Configure
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setShowIntegrationDialog(false)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowIntegrationDialog(false)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Connect to{" "}
                  {selectedIntegration.name}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IntegrationHub;
