import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  BarChart3,
  Calendar,
  Download,
  LineChart,
  PieChart,
  TrendingDown,
  TrendingUp,
  Users,
  Clock,
  MousePointerClick,
  Eye,
  ArrowRight,
  Filter,
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex space-x-2">
          <Select defaultValue="last30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">12,548</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+8.2%</span>
              <span className="text-sm text-muted-foreground ml-1">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-3xl font-bold mt-1">87,342</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+12.5%</span>
              <span className="text-sm text-muted-foreground ml-1">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold mt-1">3.8%</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MousePointerClick className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500 font-medium">-0.5%</span>
              <span className="text-sm text-muted-foreground ml-1">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session</p>
                <p className="text-3xl font-bold mt-1">4m 32s</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">+0.8%</span>
              <span className="text-sm text-muted-foreground ml-1">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>
              Website traffic sources and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center bg-muted/20 rounded-md">
              <LineChart className="h-16 w-16 text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center bg-muted/20 rounded-md">
              <PieChart className="h-16 w-16 text-muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: "/home", views: 12453, change: "+5.3%" },
                { page: "/features", views: 8732, change: "+2.1%" },
                { page: "/pricing", views: 6543, change: "+8.7%" },
                { page: "/blog/ai-trends", views: 4932, change: "+12.5%" },
                { page: "/contact", views: 3821, change: "-1.2%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.page}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.views.toLocaleString()} views
                    </p>
                  </div>
                  <span
                    className={
                      item.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 px-0">
              View all pages <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              How users interact with your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="engagement" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="retention">Retention</TabsTrigger>
                <TabsTrigger value="conversion">Conversion</TabsTrigger>
              </TabsList>
              <TabsContent value="engagement" className="space-y-4">
                <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart className="h-16 w-16 text-muted" />
                </div>
              </TabsContent>
              <TabsContent value="retention" className="space-y-4">
                <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                </div>
              </TabsContent>
              <TabsContent value="conversion" className="space-y-4">
                <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>User device breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium mb-2">Desktop</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">58%</span>
                <span className="text-sm text-muted-foreground">
                  10,245 users
                </span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Mobile</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">36%</span>
                <span className="text-sm text-muted-foreground">
                  6,372 users
                </span>
              </div>
              <Progress value={36} className="h-2" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Tablet</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">6%</span>
                <span className="text-sm text-muted-foreground">
                  1,058 users
                </span>
              </div>
              <Progress value={6} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
