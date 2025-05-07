import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Database,
  FileText,
  Link,
  LineChart,
  Settings,
  Users,
} from "lucide-react";
import ClientIntegrationWizard from "@/components/analytics/ClientIntegrationWizard";

const AnalyticsIntegrationPage = () => {
  return (
    <div className="p-6 space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Integration</h1>
          <p className="text-muted-foreground mt-1">
            Set up and manage Smart Analytics for your clients
          </p>
        </div>
        <div>
          <Button>
            <Users className="mr-2 h-4 w-4" /> New Client Integration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
          <TabsTrigger value="clients">Client Integrations</TabsTrigger>
          <TabsTrigger value="datasources">Data Sources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <ClientIntegrationWizard />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Client Integrations</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Client</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Data Sources
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Last Sync
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Features
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">Acme Corp</div>
                        <div className="text-sm text-muted-foreground">
                          ID: client-123
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3 px-4">3 connected</td>
                    <td className="py-3 px-4">30 minutes ago</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Insights</Badge>
                        <Badge variant="outline">Predictions</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <LineChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">TechStart Inc</div>
                        <div className="text-sm text-muted-foreground">
                          ID: client-456
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Pending
                      </Badge>
                    </td>
                    <td className="py-3 px-4">2 connected</td>
                    <td className="py-3 px-4">2 hours ago</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Insights</Badge>
                        <Badge variant="outline">Anomaly Detection</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <LineChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">Global Services Ltd</div>
                        <div className="text-sm text-muted-foreground">
                          ID: client-789
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3 px-4">5 connected</td>
                    <td className="py-3 px-4">10 minutes ago</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Insights</Badge>
                        <Badge variant="outline">Predictions</Badge>
                        <Badge variant="outline">Recommendations</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <LineChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="datasources" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Available Data Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 border hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">CRM Connector</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to popular CRM systems like Salesforce, HubSpot,
                      and more
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="h-7">
                        <Link className="h-3.5 w-3.5 mr-1" /> Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Marketing Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect to Google Analytics, Facebook Ads, and other
                      marketing platforms
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="h-7">
                        <Link className="h-3.5 w-3.5 mr-1" /> Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Custom Data Import</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Import data from CSV, Excel, or JSON files
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="h-7">
                        <Link className="h-3.5 w-3.5 mr-1" /> Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Analytics Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Data Processing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how data is processed and analyzed
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" /> Processing Rules
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" /> Model Configuration
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">API Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage API keys and access to the Analytics API
                </p>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> API Keys
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Default Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure default settings for new client integrations
                </p>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> Default Configuration
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsIntegrationPage;
