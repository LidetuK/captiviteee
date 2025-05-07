import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import {
  Search,
  Send,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  MoreVertical,
  Filter,
  Star,
  Archive,
  Clock,
  Calendar,
  Bot,
  MessageSquare,
  Users,
  Plus,
} from "lucide-react";

type Message = {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  date?: string;
  unread?: boolean;
  customerId?: number | null;
  type: string;
};

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  time: string;
  isCustomer: boolean;
  isAI?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content: "Hello, I'd like to schedule a consultation.",
    time: "10:30 AM",
    date: "Today",
    unread: true,
    customerId: 1,
    type: "customer",
  },
  {
    id: 2,
    sender: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    content:
      "I have a question about your services. Do you offer package discounts?",
    time: "9:45 AM",
    date: "Today",
    unread: true,
    customerId: 2,
    type: "customer",
  },
  {
    id: 3,
    sender: "Robert Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    content: "Thanks for the information you sent yesterday.",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    customerId: 3,
    type: "customer",
  },
  {
    id: 4,
    sender: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "When can we schedule our next meeting?",
    time: "Yesterday",
    date: "Yesterday",
    unread: false,
    customerId: 4,
    type: "customer",
  },
  {
    id: 5,
    sender: "Support Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Support",
    content: "New customer inquiry assigned to you.",
    time: "Monday",
    date: "Monday",
    unread: false,
    customerId: null,
    type: "system",
  },
];

const chatHistory: ChatMessage[] = [
  {
    id: 101,
    sender: "John Doe",
    content: "Hello, I'd like to schedule a consultation.",
    time: "10:30 AM",
    isCustomer: true,
  },
  {
    id: 102,
    sender: "You",
    content:
      "Hi John, I'd be happy to help you schedule a consultation. What day and time works best for you?",
    time: "10:32 AM",
    isCustomer: false,
  },
  {
    id: 103,
    sender: "John Doe",
    content: "Would next Tuesday at 2 PM work?",
    time: "10:35 AM",
    isCustomer: true,
  },
  {
    id: 104,
    sender: "You",
    content:
      "Let me check our availability... Yes, Tuesday at 2 PM works perfectly. Would you prefer an in-person or virtual consultation?",
    time: "10:38 AM",
    isCustomer: false,
  },
  {
    id: 105,
    sender: "John Doe",
    content: "Virtual would be better for me.",
    time: "10:40 AM",
    isCustomer: true,
  },
  {
    id: 106,
    sender: "You",
    content:
      "Great! I've scheduled a virtual consultation for next Tuesday at 2 PM. You'll receive a calendar invitation with the meeting link shortly. Is there anything specific you'd like to discuss during our consultation?",
    time: "10:42 AM",
    isCustomer: false,
  },
];

const MessagesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerIdParam = queryParams.get("customer");

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messageCategory, setMessageCategory] = useState("all");
  const [suggestedResponses, setSuggestedResponses] = useState([
    "I'd be happy to help you with that.",
    "When would you like to schedule your appointment?",
    "Let me check our availability and get back to you.",
    "Would you prefer a virtual or in-person meeting?",
  ]);

  // Filter messages based on search and category
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (messageCategory === "all") return matchesSearch;
    if (messageCategory === "unread") return matchesSearch && message.unread;
    if (messageCategory === "customers")
      return matchesSearch && message.type === "customer";
    if (messageCategory === "system")
      return matchesSearch && message.type === "system";

    return matchesSearch;
  });

  // Set initial selected conversation based on URL parameter
  useEffect(() => {
    if (customerIdParam) {
      const customerMessage = messages.find(
        (m) => m.customerId === parseInt(customerIdParam),
      );
      if (customerMessage) {
        setSelectedConversation(customerMessage);
      }
    } else if (messages.length > 0 && !selectedConversation) {
      setSelectedConversation(messages[0]);
    }
  }, [customerIdParam, messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Add the message to the chat history
    const newChatMessage: ChatMessage = {
      id: Date.now(),
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCustomer: false,
    };

    setChatHistory(prev => [...prev, newChatMessage]);
    setNewMessage("");

    // Generate an AI response (simulated)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: "AI Assistant",
        content:
          "I've drafted a response for you: 'Thanks for your message. I'll check our schedule and get back to you shortly.'",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCustomer: false,
        isAI: true,
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSelectConversation = (message: Message) => {
    setSelectedConversation(message);

    // Mark as read
    if (message.unread) {
      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, unread: false } : m,
        ),
      );
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" onValueChange={setMessageCategory}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex-1">
                  Customers
                </TabsTrigger>
                <TabsTrigger value="system" className="flex-1">
                  System
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${selectedConversation?.id === message.id ? "bg-muted/50" : ""}`}
                onClick={() => handleSelectConversation(message)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <img src={message.avatar} alt={message.sender} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{message.sender}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.content}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      {message.unread ? (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          <span className="ml-2 text-xs text-primary">New</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {message.date}
                        </span>
                      )}

                      {message.type === "system" && (
                        <Badge variant="outline" className="text-xs">
                          System
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <img
                        src={selectedConversation.avatar}
                        alt={selectedConversation.sender}
                      />
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">
                        {selectedConversation.sender}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Active now
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isCustomer ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.isCustomer ? "bg-muted" : message.isAI ? "bg-secondary/20" : "bg-primary text-primary-foreground"}`}
                      >
                        {message.isAI && (
                          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                            <Bot className="h-3 w-3" /> AI Suggestion
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                          <span>{message.time}</span>
                          {!message.isCustomer && !message.isAI && (
                            <span>Delivered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Suggested responses:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedResponses.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleUseSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  No conversation selected
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
