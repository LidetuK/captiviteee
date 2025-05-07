import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  Download,
  Filter,
} from "lucide-react";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30days");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              <h3 className="text-3xl font-bold mt-2">1,234</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Appointments
              </p>
              <h3 className="text-3xl font-bold mt-2">256</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Engagement Rate
              </p>
              <h3 className="text-3xl font-bold mt-2">68%</h3>
              <div className="flex items-center mt-1 text-sm text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-2% from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <h3 className="text-3xl font-bold mt-2">$45,678</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+15% from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Performance Overview</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <span>Performance Trend Chart</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Customer Growth</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-2" />
                    <span>Customer Growth Chart</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Revenue Distribution
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-2" />
                    <span>Revenue Distribution Chart</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Customer Acquisition</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <span>Customer Acquisition Chart</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Customer Segments</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-2" />
                    <span>Customer Segments Chart</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Customer Retention</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-2" />
                    <span>Customer Retention Chart</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Engagement Metrics</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <span>Engagement Metrics Chart</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Message Response Time
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-2" />
                    <span>Response Time Chart</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Channel Performance</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-2" />
                    <span>Channel Performance Chart</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Revenue Trends</h3>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-2" />
                  <span>Revenue Trends Chart</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Revenue by Service</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-2" />
                    <span>Revenue by Service Chart</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Monthly Comparison</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-2" />
                    <span>Monthly Comparison Chart</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Customer Growth</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Customer acquisition has increased by 12% compared to the
                previous period, with most new customers coming from referrals.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Revenue Increase</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenue has grown by 15% this period, primarily driven by
                increased subscription upgrades and service add-ons.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h4 className="font-medium">Engagement Dip</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Message engagement has decreased by 2%. Consider implementing
                new engagement strategies to reverse this trend.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
