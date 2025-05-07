import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Phone,
  Clock,
  ThumbsUp,
  Calendar,
  Download,
  TrendingUp,
  PieChart,
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Call Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Call Performance
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Calls</h3>
            <Phone className="text-primary" />
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-muted-foreground">+12% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Avg. Duration</h3>
            <Clock className="text-primary" />
          </div>
          <p className="text-3xl font-bold">3:45</p>
          <p className="text-sm text-muted-foreground">-8% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Success Rate</h3>
            <ThumbsUp className="text-primary" />
          </div>
          <p className="text-3xl font-bold">92%</p>
          <p className="text-sm text-muted-foreground">+5% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Appointments</h3>
            <Calendar className="text-primary" />
          </div>
          <p className="text-3xl font-bold">456</p>
          <p className="text-sm text-muted-foreground">+15% vs last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Call Volume Trends</h3>
            <TrendingUp className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            <div className="w-full h-full p-4 flex flex-col justify-end">
              <div className="flex items-end h-[200px] gap-2">
                {[35, 45, 30, 65, 50, 75, 40].map((height, i) => (
                  <div
                    key={i}
                    className="bg-primary/80 rounded-t w-full"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Common Topics</h3>
            <PieChart className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-full h-full p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Appointment Scheduling</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Product Inquiries</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Support Issues</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Voice Quality</h3>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
          <div className="h-[300px] flex flex-col justify-between">
            <div className="space-y-4 p-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Clarity</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Natural Tone</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Pronunciation</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Voice Provider: <span className="font-medium">ElevenLabs</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Outbound Call Performance</h3>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Connection Rate
            </h4>
            <p className="text-2xl font-bold">68%</p>
            <p className="text-xs text-green-600">+5% vs last month</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Conversion Rate
            </h4>
            <p className="text-2xl font-bold">42%</p>
            <p className="text-xs text-green-600">+3% vs last month</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Avg. Call Time
            </h4>
            <p className="text-2xl font-bold">4:12</p>
            <p className="text-xs text-red-600">-2% vs last month</p>
          </div>
        </div>
        <div className="h-[200px] border rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Outbound call performance chart
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
