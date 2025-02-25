import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Bot, Settings, Code } from "lucide-react";

const AgentBuilder = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="flows">Conversation Flows</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="personality">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>Agent Name</Label>
                <Input placeholder="e.g. Sarah from Customer Service" />
              </div>

              <div>
                <Label>Voice Profile</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>Professional Female</option>
                  <option>Professional Male</option>
                  <option>Friendly Female</option>
                  <option>Friendly Male</option>
                </select>
              </div>

              <div>
                <Label>Personality Description</Label>
                <Textarea
                  placeholder="Describe how your agent should behave and speak..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Sample Dialogues</Label>
                <Textarea
                  placeholder="Add example conversations to train your agent's style..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="flows">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Conversation Flows</h3>
                <Button>
                  <Code className="mr-2 h-4 w-4" /> Add Flow
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Appointment Booking</h4>
                      <p className="text-sm text-muted-foreground">
                        Handle scheduling and appointment requests
                      </p>
                    </div>
                    <Button variant="outline">Edit Flow</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Support Inquiries</h4>
                      <p className="text-sm text-muted-foreground">
                        Handle common support questions
                      </p>
                    </div>
                    <Button variant="outline">Edit Flow</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <Label>Business Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="time" placeholder="Start Time" />
                  <Input type="time" placeholder="End Time" />
                </div>
              </div>

              <div>
                <Label>Call Recording</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="recording" />
                  <label htmlFor="recording">Enable call recording</label>
                </div>
              </div>

              <div>
                <Label>Fallback Number</Label>
                <Input placeholder="Number to forward to if AI fails" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Test Your Agent</h3>
                <Button>
                  <Phone className="mr-2 h-4 w-4" /> Start Test Call
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Recent Test Calls</h4>
                <div className="space-y-2">{/* Test call history items */}</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentBuilder;
