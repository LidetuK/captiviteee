import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hello, I'd like to schedule a consultation.",
    time: "10:30 AM",
    unread: true,
  },
  // Add more messages
];

const MessagesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search messages..." />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 border-b hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{message.sender}</h3>
                  <span className="text-xs text-muted-foreground">
                    {message.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {message.content}
                </p>
                {message.unread && (
                  <div className="mt-2 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="ml-2 text-xs text-primary">New</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {/* Chat messages will go here */}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-4">
              <Input placeholder="Type your message..." />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
