import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Mic,
  Image as ImageIcon,
  Paperclip,
  Smile,
  User,
} from "lucide-react";

const AIAssistantPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      role: "user",
      content:
        "I need help setting up a new campaign for our product launch next month.",
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      role: "assistant",
      content:
        "I'd be happy to help with your product launch campaign! To get started, could you tell me more about your product, target audience, and the key goals for this campaign?",
      timestamp: "10:31 AM",
    },
    {
      id: 4,
      role: "user",
      content:
        "It's a new software tool for small businesses. We're targeting marketing managers at companies with 10-50 employees. Our goal is to get 100 sign-ups in the first month.",
      timestamp: "10:32 AM",
    },
    {
      id: 5,
      role: "assistant",
      content:
        "Thanks for the details! Based on your target audience and goals, I recommend a multi-channel approach:\n\n1. **Email Campaign**: Create a sequence targeting marketing managers with pain points your software solves\n2. **Social Media**: LinkedIn ads focused on small business professionals\n3. **Content Marketing**: Case studies showing ROI for similar businesses\n4. **Limited-Time Offer**: Special pricing for early adopters\n\nWould you like me to help develop any of these strategies in more detail?",
      timestamp: "10:33 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newUserMessage]);
    setInput("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "I'm analyzing your request and will provide a detailed response shortly. Is there any specific aspect of your question you'd like me to focus on?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=Captivite" />
            <AvatarFallback>
              <Bot />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Your intelligent business companion
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar
                    className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                  >
                    {message.role === "assistant" ? (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=Captivite" />
                        <AvatarFallback>
                          <Bot />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Mic className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs text-muted-foreground">
              AI Assistant can help with marketing, analytics, customer support,
              and more
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
