import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mic, MicOff, PhoneOff } from "lucide-react";

interface Call {
  id: string;
  number: string;
  status: "active" | "waiting" | "completed";
  duration: number;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: Date;
}

const CallMonitor = () => {
  const [activeCalls, setActiveCalls] = React.useState<Call[]>([
    {
      id: "1",
      number: "+1 (555) 123-4567",
      status: "active",
      duration: 120,
      sentiment: "positive",
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Live Calls</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mic className="mr-2 h-4 w-4" /> Listen
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Take Over
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {activeCalls.map((call) => (
          <Card key={call.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium">{call.number}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {Math.floor(call.duration / 60)}:
                  {call.duration % 60}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Live Transcript</div>
              <div className="bg-muted p-4 rounded-md h-32 overflow-auto">
                {/* Live transcript content */}
                <p className="text-sm text-muted-foreground">
                  Agent: How may I help you today?
                </p>
                <p className="text-sm">
                  Caller: I'd like to schedule an appointment.
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CallMonitor;
