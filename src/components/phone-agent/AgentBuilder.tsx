import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Bot,
  Settings,
  Code,
  Headphones,
  Plus,
  Calendar,
  FileText,
  MessageSquare,
  Webhook,
  Database,
  Mic,
  Volume2,
} from "lucide-react";

const AgentBuilder = () => {
  const [agentName, setAgentName] = useState("Sarah from Customer Service");
  const [voiceType, setVoiceType] = useState("professional-female");
  const [personality, setPersonality] = useState(
    "Friendly, professional, and helpful. Speaks clearly and concisely.",
  );
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567");
  const [llmProvider, setLlmProvider] = useState("gpt-4");
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs");
  const [apiKey, setApiKey] = useState("");
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState(
    "21m00Tcm4TlvDq8ikWAM",
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Captivite AI Phone Agent</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Make Outbound Call
          </Button>
          <Button>
            <Phone className="mr-2 h-4 w-4" /> Deploy Agent
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="flows">Conversation Flows</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="personality">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Agent Identity</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g. Sarah from Customer Service"
                    />
                  </div>

                  <div>
                    <Label htmlFor="voice-provider">Voice Technology</Label>
                    <Select
                      value={voiceProvider}
                      onValueChange={setVoiceProvider}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="native">Native System</SelectItem>
                        <SelectItem value="amazon">Amazon Polly</SelectItem>
                        <SelectItem value="google">Google Cloud TTS</SelectItem>
                      </SelectContent>
                    </Select>

                    {voiceProvider === "elevenlabs" && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label htmlFor="elevenlabs-api-key">
                            ElevenLabs API Key
                          </Label>
                          <Input
                            id="elevenlabs-api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your ElevenLabs API key"
                          />
                        </div>
                        <div>
                          <Label htmlFor="elevenlabs-voice-id">
                            ElevenLabs Voice ID
                          </Label>
                          <Select
                            value={elevenlabsVoiceId}
                            onValueChange={setElevenlabsVoiceId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select voice ID" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="21m00Tcm4TlvDq8ikWAM">
                                Rachel (Female)
                              </SelectItem>
                              <SelectItem value="AZnzlk1XvdvUeBnXmlld">
                                Domi (Male)
                              </SelectItem>
                              <SelectItem value="EXAVITQu4vr4xnSDxMaL">
                                Bella (Female)
                              </SelectItem>
                              <SelectItem value="ErXwobaYiN019PkySvjV">
                                Antoni (Male)
                              </SelectItem>
                              <SelectItem value="MF3mGyEYCl7XYWbV9V6O">
                                Elli (Female)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="voice-type">Voice Profile</Label>
                    <Select value={voiceType} onValueChange={setVoiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional-female">
                          Professional Female
                        </SelectItem>
                        <SelectItem value="professional-male">
                          Professional Male
                        </SelectItem>
                        <SelectItem value="friendly-female">
                          Friendly Female
                        </SelectItem>
                        <SelectItem value="friendly-male">
                          Friendly Male
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Personality & Behavior
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personality-description">
                      Personality Description
                    </Label>
                    <Textarea
                      id="personality-description"
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="Describe how your agent should behave and speak..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sample-dialogues">Sample Dialogues</Label>
                    <Textarea
                      id="sample-dialogues"
                      placeholder="Add example conversations to train your agent's style..."
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Agent Preview</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-1">{agentName}</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">
                      {voiceType.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="w-full p-4 bg-muted rounded-lg mb-4">
                    <p className="text-sm italic">"{personality}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" size="sm">
                      <Volume2 className="mr-2 h-4 w-4" /> Listen Voice
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="mr-2 h-4 w-4" /> Record Voice
                    </Button>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" /> Test Call
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flows">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Conversation Flows</h3>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Flow
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Appointment Booking</h4>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Flow
                    </Button>
                    <Switch checked={true} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Handle scheduling and appointment requests
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>6 steps configured</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Support Inquiries</h4>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Flow
                    </Button>
                    <Switch checked={true} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Handle common support questions
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>6 steps configured</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">AI & Language Model</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="llm-provider">Language Model</Label>
                <Select value={llmProvider} onValueChange={setLlmProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select LLM provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="palm">PaLM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Phone Provider</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone-provider">Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue placeholder="Select phone provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="plivo">Plivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Integrations</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-1">CRM Integration</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Connect to Salesforce, HubSpot, etc.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect CRM
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-1">Calendar Integration</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Connect to Google Calendar or Outlook
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" /> Connect Calendar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Operational Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-hours">Business Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Start Time
                    </p>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      End Time
                    </p>
                    <Input type="time" defaultValue="17:00" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fallback-number">Fallback Number</Label>
                <Input
                  id="fallback-number"
                  placeholder="Number to forward to if AI fails"
                  defaultValue="+1 (555) 987-6543"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="recording" className="mb-1 block">
                    Call Recording
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Record calls for quality and training
                  </p>
                </div>
                <Switch id="recording" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="prompt-filtering" className="mb-1 block">
                    Prompt Filtering
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Filter sensitive information from prompts
                  </p>
                </div>
                <Switch id="prompt-filtering" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sentiment-routing" className="mb-1 block">
                    Sentiment-based Routing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Transfer to human agent when negative sentiment detected
                  </p>
                </div>
                <Switch id="sentiment-routing" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Translation Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="real-time-translation"
                      className="mb-1 block"
                    >
                      Real-time Translation
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable multilingual support during calls
                    </p>
                  </div>
                  <Switch id="real-time-translation" />
                </div>

                <div>
                  <Label htmlFor="supported-languages">
                    Supported Languages
                  </Label>
                  <Select defaultValue="en-es">
                    <SelectTrigger>
                      <SelectValue placeholder="Select languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-es">English & Spanish</SelectItem>
                      <SelectItem value="en-fr">English & French</SelectItem>
                      <SelectItem value="en-de">English & German</SelectItem>
                      <SelectItem value="en-zh">English & Chinese</SelectItem>
                      <SelectItem value="all">
                        All Available Languages
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Voice Authentication
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="biometric-auth" className="mb-1 block">
                      Biometric Voice Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify caller identity using voice biometrics
                    </p>
                  </div>
                  <Switch id="biometric-auth" />
                </div>

                <div>
                  <Label htmlFor="auth-level">Authentication Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select security level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Low (Basic Verification)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (Standard Security)
                      </SelectItem>
                      <SelectItem value="high">
                        High (Enhanced Security)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="auth-actions">Required For</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="auth-sensitive"
                        className="rounded"
                        defaultChecked
                      />
                      <label htmlFor="auth-sensitive" className="text-sm">
                        Sensitive Information
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="auth-transactions"
                        className="rounded"
                        defaultChecked
                      />
                      <label htmlFor="auth-transactions" className="text-sm">
                        Financial Transactions
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="auth-account"
                        className="rounded"
                      />
                      <label htmlFor="auth-account" className="text-sm">
                        Account Changes
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Knowledge Base</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="kb-integration" className="mb-1 block">
                      Knowledge Base Integration
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Connect to documentation for accurate information
                    </p>
                  </div>
                  <Switch id="kb-integration" defaultChecked />
                </div>

                <div>
                  <Label htmlFor="kb-source">Knowledge Source</Label>
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue placeholder="Select knowledge source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">
                        Internal Documentation
                      </SelectItem>
                      <SelectItem value="zendesk">Zendesk</SelectItem>
                      <SelectItem value="confluence">Confluence</SelectItem>
                      <SelectItem value="sharepoint">SharePoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> Connect Knowledge Base
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Custom Workflow Builder
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create visual decision trees for complex call flows
                </p>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-center text-sm text-muted-foreground">
                    Visual workflow editor preview
                  </p>
                </div>

                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Open Workflow Builder
                </Button>
              </div>
            </Card>
          </div>
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <p className="font-medium">Test Call #1</p>
                      <p className="text-sm text-muted-foreground">
                        Today, 2:30 PM - 3 min
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Listen
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentBuilder;
