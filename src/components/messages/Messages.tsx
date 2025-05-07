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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
  Clock,
  CheckCheck,
  Filter,
  Archive,
  Trash2,
  Bell,
  BellOff,
  Users,
} from "lucide-react";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      lastMessage: "I'll check the proposal and get back to you.",
      time: "10:42 AM",
      unread: 0,
      online: true,
    },
    {
      id: 2,
      name: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
      lastMessage: "Can we schedule a demo for tomorrow?",
      time: "Yesterday",
      unread: 3,
      online: false,
    },
    {
      id: 3,
      name: "TechCorp Team",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      lastMessage: "Michael: We need to discuss the integration timeline",
      time: "Yesterday",
      unread: 0,
      online: false,
      isGroup: true,
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      lastMessage: "Thanks for your help with the onboarding!",
      time: "Monday",
      unread: 0,
      online: true,
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      lastMessage: "Let me know when the new features are ready",
      time: "Monday",
      unread: 0,
      online: false,
    },
    {
      id: 6,
      name: "Product Team",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Product",
      lastMessage: "Sarah: I've shared the roadmap document",
      time: "Last week",
      unread: 0,
      online: false,
      isGroup: true,
    },
  ];

  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content:
        "Hi there! I've been reviewing the automation proposal you sent over.",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      conversationId: 1,
      sender: "Me",
      content:
        "Great to hear from you, Alex! Did you have any questions about the implementation timeline?",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      conversationId: 1,
      sender: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content:
        "Yes, actually. We're wondering if we could accelerate the deployment for the CRM integration. Our team is eager to start using those features.",
      time: "10:35 AM",
      isMe: false,
    },
    {
      id: 4,
      conversationId: 1,
      sender: "Me",
      content:
        "I understand the urgency. We might be able to prioritize that module. Let me check with our implementation team and see if we can move up the timeline.",
      time: "10:38 AM",
      isMe: true,
    },
    {
      id: 5,
      conversationId: 1,
      sender: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content:
        "That would be fantastic! We're particularly interested in the automated lead scoring functionality.",
      time: "10:40 AM",
      isMe: false,
    },
    {
      id: 6,
      conversationId: 1,
      sender: "Me",
      content:
        "The lead scoring is definitely one of our most powerful features. I'll put together a specific timeline for that component and share it with you by end of day.",
      time: "10:41 AM",
      isMe: true,
    },
    {
      id: 7,
      conversationId: 1,
      sender: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content: "I'll check the proposal and get back to you.",
      time: "10:42 AM",
      isMe: false,
    },
    {
      id: 8,
      conversationId: 2,
      sender: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
      content:
        "Hello! I've been exploring your platform and I'm impressed with the automation capabilities.",
      time: "Yesterday",
      isMe: false,
    },
    {
      id: 9,
      conversationId: 2,
      sender: "Me",
      content:
        "Thanks, Samantha! We're proud of our automation suite. Is there a specific feature you're interested in?",
      time: "Yesterday",
      isMe: true,
    },
    {
      id: 10,
      conversationId: 2,
      sender: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
      content:
        "The email sequence builder looks powerful. We're currently using a different solution but it's not as intuitive.",
      time: "Yesterday",
      isMe: false,
    },
    {
      id: 11,
      conversationId: 2,
      sender: "Samantha Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
      content: "Can we schedule a demo for tomorrow?",
      time: "Yesterday",
      isMe: false,
    },
  ];

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeMessages = messages.filter(
    (message) => message.conversationId === activeConversation,
  );

  const activeConversationData = conversations.find(
    (conversation) => conversation.id === activeConversation,
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // In a real app, you would send this to your backend
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${activeConversation === conversation.id ? "bg-muted" : ""}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={conversation.avatar}
                        alt={conversation.name}
                      />
                      <AvatarFallback>
                        {conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                    {conversation.isGroup && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                        <Users className="h-2 w-2 text-primary-foreground" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">
                        {conversation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.time}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="ml-auto">{conversation.unread}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-full">
          {activeConversationData ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={activeConversationData.avatar}
                        alt={activeConversationData.name}
                      />
                      <AvatarFallback>
                        {activeConversationData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {activeConversationData.name}
                        {activeConversationData.online && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-green-100 text-green-800 border-green-200 text-xs"
                          >
                            Online
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {activeConversationData.isGroup
                          ? "Group conversation"
                          : "Last active today"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[80%] ${message.isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!message.isMe && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={message.avatar}
                            alt={message.sender}
                          />
                          <AvatarFallback>
                            {message.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg p-3 ${message.isMe ? "bg-primary text-primary-foreground ml-2" : "bg-muted"}`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div
                          className={`flex items-center mt-1 text-xs text-muted-foreground ${message.isMe ? "justify-end" : ""}`}
                        >
                          <span>{message.time}</span>
                          {message.isMe && (
                            <CheckCheck className="h-3 w-3 ml-1 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 flex-shrink-0"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-10 flex-1 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 flex-shrink-0"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-4 flex-shrink-0"
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-muted-foreground mb-4">
                Select a conversation or start a new one
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Message
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const MessageSquare = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default Messages;
