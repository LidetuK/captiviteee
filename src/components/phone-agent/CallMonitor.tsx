import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  User,
  Bot,
  Clock,
  Search,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Meh,
  AlertTriangle,
} from "lucide-react";

interface Call {
  id: string;
  number: string;
  name?: string;
  status: "active" | "waiting" | "completed" | "missed" | "transferred";
  duration: number;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: Date;
  agent: "ai" | "human";
  intent?: string;
  transcript?: string[];
  isSelected?: boolean;
  flagged?: boolean;
}

const CallMonitor: React.FC = () => {
  const [activeCalls, setActiveCalls] = useState<Call[]>([
    {
      id: "1",
      number: "+1 (555) 123-4567",
      name: "John Doe",
      status: "active",
      duration: 120,
      sentiment: "positive",
      timestamp: new Date(),
      agent: "ai",
      intent: "Appointment Scheduling",
      transcript: [
        "Agent: Thank you for calling. This is Sarah from Customer Service. How may I help you today?",
        "Caller: I'd like to schedule an appointment.",
        "Agent: I'd be happy to help you schedule an appointment. What day works best for you?",
        "Caller: I was thinking next Tuesday afternoon.",
        "Agent: Let me check our availability for next Tuesday afternoon. We have openings at 2 PM, 3 PM, and 4 PM. Which time would you prefer?",
        "Caller: 3 PM works for me.",
      ],
      isSelected: true,
    },
    {
      id: "2",
      number: "+1 (555) 987-6543",
      name: "Jane Smith",
      status: "waiting",
      duration: 45,
      sentiment: "neutral",
      timestamp: new Date(),
      agent: "ai",
      intent: "Product Information",
    },
    {
      id: "3",
      number: "+1 (555) 444-3333",
      name: "Alex Johnson",
      status: "active",
      duration: 78,
      sentiment: "negative",
      timestamp: new Date(),
      agent: "ai",
      intent: "Complaint",
      flagged: true,
    },
  ]);

  const [recentCalls, setRecentCalls] = useState<Call[]>([
    {
      id: "4",
      number: "+1 (555) 234-5678",
      name: "Robert Johnson",
      status: "completed",
      duration: 345,
      sentiment: "positive",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      agent: "ai",
      intent: "Support Request",
    },
    {
      id: "5",
      number: "+1 (555) 876-5432",
      name: "Sarah Williams",
      status: "missed",
      duration: 0,
      sentiment: "neutral",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      agent: "ai",
    },
  ]);

  const [selectedCall, setSelectedCall] = useState<Call | null>(activeCalls[0]);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callView, setCallView] = useState<"active" | "recent">("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Update call durations every second for active calls
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCalls((prevCalls) =>
        prevCalls.map((call) =>
          call.status === "active"
            ? { ...call, duration: call.duration + 1 }
            : call,
        ),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectCall = (call: Call) => {
    setSelectedCall(call);
  };

  const handleToggleListen = () => {
    setIsListening(!isListening);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleEndCall = (callId: string) => {
    // Move the call from active to recent
    const callToEnd = activeCalls.find((call) => call.id === callId);
    if (callToEnd) {
      const updatedCall = { ...callToEnd, status: "completed" as const };
      setRecentCalls([updatedCall, ...recentCalls]);
      setActiveCalls(activeCalls.filter((call) => call.id !== callId));

      // If the ended call was selected, select another active call or set to null
      if (selectedCall?.id === callId) {
        const nextCall = activeCalls.find((call) => call.id !== callId);
        setSelectedCall(nextCall || null);
      }
    }
  };

  const handleTakeOver = (callId: string) => {
    // Change the agent from AI to human
    setActiveCalls(
      activeCalls.map((call) =>
        call.id === callId ? { ...call, agent: "human" as const } : call,
      ),
    );
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const getSentimentIcon = (sentiment: Call["sentiment"]): React.ReactNode => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: Call["status"]): React.ReactNode => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "waiting":
        return <Badge className="bg-yellow-500">Waiting</Badge>;
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600">
            Completed
          </Badge>
        );
      case "missed":
        return (
          <Badge variant="outline" className="text-red-600">
            Missed
          </Badge>
        );
      case "transferred":
        return (
          <Badge variant="outline" className="text-blue-600">
            Transferred
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAgentBadge = (agent: Call["agent"]): React.ReactNode => {
    return agent === "ai" ? (
      <Badge variant="outline" className="bg-primary/10 text-primary">
        AI Agent
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-secondary/10 text-secondary">
        Human Agent
      </Badge>
    );
  };

  const filteredCalls =
    callView === "active"
      ? activeCalls
      : recentCalls.filter((call) => {
          // Filter by search term
          return (
            call.number.includes(searchTerm) ||
            (call.name &&
              call.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (call.intent &&
              call.intent.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Call Monitor</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Make Outbound Call
          </Button>
          <Button variant="outline">Refresh</Button>
        </div>
      </div>

      <Tabs 
        defaultValue="active" 
        onValueChange={(value) => setCallView(value as "active" | "recent")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex gap-2">
            <Phone className="h-4 w-4" />
            Active Calls
            <Badge className="ml-1 bg-primary/10 text-primary">
              {activeCalls.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex gap-2">
            <Clock className="h-4 w-4" />
            Recent Calls
            <Badge className="ml-1 bg-muted text-muted-foreground">
              {recentCalls.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {callView === "recent" && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, number, or intent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <div className="p-4 border-b">
              <h3 className="font-semibold">
                {callView === "active" ? "Active Calls" : "Recent Calls"}
              </h3>
            </div>

            <ScrollArea className="h-[calc(100vh-20rem)]">
              {filteredCalls.length > 0 ? (
                <div className="divide-y">
                  {filteredCalls.map((call) => (
                    <div
                      key={call.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${call.id === selectedCall?.id ? "bg-muted/50" : ""}`}
                      onClick={() => handleSelectCall(call)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {call.status === "active" && (
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            )}
                            <span className="font-medium">
                              {call.name || "Unknown Caller"}
                            </span>
                            {call.flagged && (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {call.number}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(call.status)}
                            {call.intent && (
                              <span className="text-xs text-muted-foreground">
                                {call.intent}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">
                            {call.status === "active"
                              ? formatDuration(call.duration)
                              : formatTimestamp(call.timestamp)}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            {getSentimentIcon(call.sentiment)}
                            {getAgentBadge(call.agent)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {callView === "active"
                      ? "No active calls"
                      : "No calls match your filters"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>

          <Card className="lg:col-span-2">
            {selectedCall ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/10">
                        {selectedCall.agent === "ai" ? (
                          <Bot className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-secondary" />
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {selectedCall.name || "Unknown Caller"}
                          </h3>
                          {getStatusBadge(selectedCall.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{selectedCall.number}</span>
                          <span>•</span>
                          <span>
                            {selectedCall.status === "active"
                              ? `${formatDuration(selectedCall.duration)}`
                              : `${formatTimestamp(selectedCall.timestamp)}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedCall.status === "active" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant={isListening ? "default" : "outline"}
                          size="sm"
                          onClick={handleToggleListen}
                        >
                          {isListening ? (
                            <Volume2 className="mr-2 h-4 w-4" />
                          ) : (
                            <VolumeX className="mr-2 h-4 w-4" />
                          )}
                          {isListening ? "Listening" : "Listen"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTakeOver(selectedCall.id)}
                          disabled={selectedCall.agent === "human"}
                        >
                          <User className="mr-2 h-4 w-4" /> Take Over
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndCall(selectedCall.id)}
                        >
                          <PhoneOff className="mr-2 h-4 w-4" /> End Call
                        </Button>
                      </div>
                    )}

                    {selectedCall.status !== "active" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Call Information</h4>
                    {selectedCall.status === "active" &&
                      selectedCall.agent === "human" && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isMuted ? "default" : "outline"}
                            size="sm"
                            onClick={handleToggleMute}
                          >
                            {isMuted ? (
                              <MicOff className="mr-2 h-4 w-4" />
                            ) : (
                              <Mic className="mr-2 h-4 w-4" />
                            )}
                            {isMuted ? "Unmute" : "Mute"}
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Intent</p>
                      <p className="font-medium">
                        {selectedCall.intent || "Unknown"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sentiment</p>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(selectedCall.sentiment)}
                        <span className="font-medium capitalize">
                          {selectedCall.sentiment}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Agent Type
                      </p>
                      <p className="font-medium">
                        {selectedCall.agent === "ai"
                          ? "AI Agent"
                          : "Human Agent"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {formatDuration(selectedCall.duration)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Voice Provider
                      </p>
                      <p className="font-medium">ElevenLabs</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Phone Provider
                      </p>
                      <p className="font-medium">Twilio</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium mb-2">Live Transcript</h4>
                  <ScrollArea className="h-[calc(100vh-36rem)] min-h-[200px] border rounded-md p-4">
                    {selectedCall.transcript ? (
                      <div className="space-y-3">
                        {selectedCall.transcript.map((line, index) => {
                          const isAgent = line.startsWith("Agent:");
                          return (
                            <div
                              key={index}
                              className={`${isAgent ? "text-muted-foreground" : ""}`}
                            >
                              <p className="text-sm">{line}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No transcript available for this call
                      </p>
                    )}
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 h-[calc(100vh-20rem)]">
                <div className="text-center">
                  <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No call selected</h3>
                  <p className="text-muted-foreground">
                    Select a call from the list to view details
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default CallMonitor;
