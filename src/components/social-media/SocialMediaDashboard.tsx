import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Grid,
  List,
  Plus,
  Settings,
  BarChart,
  Users,
  FileText,
} from "lucide-react";
import ContentCalendar from "./ContentCalendar";
import PostComposer from "./PostComposer";
import AccountsManager from "./AccountsManager";
import ContentLibrary from "./ContentLibrary";
import AnalyticsOverview from "./AnalyticsOverview";
import SettingsPanel from "./SettingsPanel";

const SocialMediaDashboard = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Social Media Management
          </h1>
          <p className="text-muted-foreground">
            Manage all your social media accounts in one place
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.open("#", "_blank")}>
            <FileText className="mr-2 h-4 w-4" /> View Guide
          </Button>
          <Button onClick={() => setShowComposer(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="compose">
            <Grid className="mr-2 h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="library">
            <List className="mr-2 h-4 w-4" /> Content Library
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <Users className="mr-2 h-4 w-4" /> Accounts
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
                <CardDescription>
                  Your social media performance at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      Scheduled Posts
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-green-600">
                      +3 from last week
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Engagement
                    </div>
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-xs text-green-600">
                      +15% from last week
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      Active Accounts
                    </div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs text-blue-600">
                      2 need attention
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get help with your social media strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-medium">Content Suggestions</p>
                    <p className="text-muted-foreground">
                      Based on your audience engagement, try posting more video
                      content on Tuesdays.
                    </p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-medium">Optimal Posting Times</p>
                    <p className="text-muted-foreground">
                      Your audience is most active between 6-8pm on weekdays.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Get More Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Posts</CardTitle>
                <CardDescription>
                  Your scheduled content for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 border-b pb-4 last:border-0"
                    >
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-blue-500"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            New Product Announcement
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tomorrow, 10:00 AM
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Excited to announce our new feature that will
                          revolutionize how you manage social media...
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Facebook
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Twitter
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            LinkedIn
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>
                  How your recent posts have performed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 border-b pb-4 last:border-0"
                    >
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-pink-500"
                        >
                          <rect
                            width="20"
                            height="20"
                            x="2"
                            y="2"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Customer Success Story</p>
                          <div className="flex items-center space-x-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-red-500"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span className="text-sm">124</span>
                          </div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-muted-foreground">
                            Posted 2 days ago
                          </p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                              >
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                              </svg>
                              <span className="text-sm">32</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                              >
                                <polyline points="17 1 21 5 17 9" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <polyline points="7 23 3 19 7 15" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                              </svg>
                              <span className="text-sm">18</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <ContentCalendar />
        </TabsContent>

        <TabsContent value="library">
          <ContentLibrary />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountsManager />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      {showComposer && <PostComposer onClose={() => setShowComposer(false)} date={new Date()} />}
    </div>
  );
};

export default SocialMediaDashboard;
