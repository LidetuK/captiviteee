import { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  ChevronRight,
  Code,
  Copy,
  Download,
  FileText,
  Headphones,
  Info,
  Languages,
  Layers,
  MessageCircle,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Play,
  Plus,
  Puzzle,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Sparkles,
  ThumbsUp,
  User,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";

const AIAssistantPage: FC = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<
    Array<{ id: string; role: string; content: string; timestamp: Date }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState("general");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showIntegrationsDialog, setShowIntegrationsDialog] = useState(false);

  // Sample assistants
  const assistants = [
    {
      id: "general",
      name: "General Assistant",
      description: "All-purpose AI assistant for various tasks",
      icon: <Bot className="h-5 w-5" />,
    },
    {
      id: "customer-support",
      name: "Customer Support",
      description: "Specialized in handling customer inquiries",
      icon: <Headphones className="h-5 w-5" />,
    },
    {
      id: "content-writer",
      name: "Content Writer",
      description: "Creates marketing and website content",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "code-assistant",
      name: "Code Assistant",
      description: "Helps with programming and technical tasks",
      icon: <Code className="h-5 w-5" />,
    },
    {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Analyzes data and generates insights",
      icon: <Layers className="h-5 w-5" />,
    },
  ];

  // Sample templates
  const templates = [
    {
      id: "customer-response",
      name: "Customer Response",
      description: "Template for responding to customer inquiries",
      category: "Support",
    },
    {
      id: "product-description",
      name: "Product Description",
      description: "Create compelling product descriptions",
      category: "Marketing",
    },
    {
      id: "meeting-summary",
      name: "Meeting Summary",
      description: "Summarize key points from meetings",
      category: "Productivity",
    },
    {
      id: "code-review",
      name: "Code Review",
      description: "Review code for best practices and issues",
      category: "Development",
    },
    {
      id: "social-post",
      name: "Social Media Post",
      description: "Create engaging social media content",
      category: "Marketing",
    },
    {
      id: "email-campaign",
      name: "Email Campaign",
      description: "Draft professional email campaigns",
      category: "Marketing",
    },
  ];

  // Sample integrations
  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Connect with Slack channels and DMs",
      connected: true,
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Integrate with your email",
      connected: false,
    },
    {
      id: "zendesk",
      name: "Zendesk",
      description: "Connect with customer support tickets",
      connected: true,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Integrate with repositories and issues",
      connected: false,
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect with CRM data",
      connected: false,
    },
    {
      id: "notion",
      name: "Notion",
      description: "Access and update Notion documents",
      connected: true,
    },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response generator (would be replaced with actual AI in production)
  const generateResponse = (input: string) => {
    const responses = [
      "I understand your request. Here's what I can help with...",
      "That's an interesting question. Based on my analysis...",
      "I've processed your input and here are my thoughts...",
      "Thank you for sharing that information. Here's my response...",
      "I've analyzed your request and can provide the following assistance...",
    ];

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      " This is a simulated response that would be replaced with actual AI-generated content in a production environment."
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground mt-1">
              Intelligent assistance for your business needs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTemplatesDialog(true)}
            >
              <Wand2 className="mr-2 h-4 w-4" /> Templates
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowIntegrationsDialog(true)}
            >
              <Puzzle className="mr-2 h-4 w-4" /> Integrations
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(true)}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  AI Assistants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assistants.map((assistant) => (
                  <div
                    key={assistant.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedAssistant === assistant.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setSelectedAssistant(assistant.id)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAssistant === assistant.id ? "bg-primary/20" : "bg-muted"}`}
                    >
                      {assistant.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {assistant.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {assistant.description}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start mt-2"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Custom Assistant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Assistant Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Knowledge Base</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Multilingual</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Voice Interaction</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Document Analysis</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Code Generation</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {assistants.find((a) => a.id === selectedAssistant)
                        ?.icon || <Bot className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <CardTitle>
                        {assistants.find((a) => a.id === selectedAssistant)
                          ?.name || "AI Assistant"}
                      </CardTitle>
                      <CardDescription>
                        {assistants.find((a) => a.id === selectedAssistant)
                          ?.description ||
                          "Intelligent assistant for your tasks"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clear conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        How can I help you today?
                      </h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        Ask me anything about your business, data analysis,
                        content creation, or technical questions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                        {[
                          {
                            icon: <MessageCircle className="h-4 w-4" />,
                            text: "How can I improve customer engagement?",
                          },
                          {
                            icon: <FileText className="h-4 w-4" />,
                            text: "Draft an email to our clients about our new feature",
                          },
                          {
                            icon: <Layers className="h-4 w-4" />,
                            text: "Analyze our recent sales data",
                          },
                          {
                            icon: <Code className="h-4 w-4" />,
                            text: "Help me debug this code snippet",
                          },
                        ].map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start"
                            onClick={() => {
                              setInputValue(suggestion.text);
                              setTimeout(() => handleSendMessage(), 100);
                            }}
                          >
                            {suggestion.icon}
                            <span className="ml-2 truncate">
                              {suggestion.text}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === "user" ? "bg-primary/10" : "bg-secondary/10"}`}
                            >
                              {message.role === "user" ? (
                                <User className="h-4 w-4 text-primary" />
                              ) : (
                                <Bot className="h-4 w-4 text-secondary-foreground" />
                              )}
                            </div>
                            <div>
                              <div
                                className={`rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                              >
                                <p className="whitespace-pre-wrap">
                                  {message.content}
                                </p>
                              </div>
                              <div
                                className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : ""}`}
                              >
                                {formatTime(message.timestamp)}
                                {message.role === "assistant" && (
                                  <span className="ml-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5"
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-secondary/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-secondary-foreground" />
                            </div>
                            <div>
                              <div className="rounded-lg p-3 bg-muted">
                                <div className="flex space-x-2">
                                  <div
                                    className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 rounded-full bg-muted-foreground/30 animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="relative flex-1">
                      <Textarea
                        placeholder="Type your message here..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-10 resize-none pr-12"
                        rows={1}
                      />
                      <Button
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setVoiceMode(!voiceMode)}
                      className={
                        voiceMode
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                          : ""
                      }
                    >
                      {voiceMode ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      <span>
                        AI responses are generated and may not always be
                        accurate
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6"
                        onClick={clearConversation}
                      >
                        Clear conversation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Assistant Settings</DialogTitle>
            <DialogDescription>
              Customize your AI assistant's behavior and capabilities
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="model">AI Model</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assistant-name" className="text-right">
                    Assistant Name
                  </Label>
                  <Input
                    id="assistant-name"
                    defaultValue="AI Assistant"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assistant-role" className="text-right">
                    Primary Role
                  </Label>
                  <Select defaultValue="general">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Assistant</SelectItem>
                      <SelectItem value="customer-support">
                        Customer Support
                      </SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                      <SelectItem value="technical">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="data">Data Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="language" className="text-right">
                    Primary Language
                  </Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Voice Interaction</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="voice-enabled" defaultChecked />
                    <Label htmlFor="voice-enabled">
                      Enable voice input and output
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Conversation Memory</Label>
                  <div className="col-span-3">
                    <Select defaultValue="session">
                      <SelectTrigger>
                        <SelectValue placeholder="Select memory retention" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          No Memory (Stateless)
                        </SelectItem>
                        <SelectItem value="session">Session Only</SelectItem>
                        <SelectItem value="short">
                          Short Term (1 week)
                        </SelectItem>
                        <SelectItem value="long">
                          Long Term (1 month)
                        </SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="model" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    AI Model
                  </Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude">Claude 2</SelectItem>
                      <SelectItem value="palm">PaLM 2</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temperature" className="text-right">
                    Temperature
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Slider defaultValue={[0.7]} max={1} step={0.1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precise (0.0)</span>
                      <span>Balanced (0.7)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="context-length" className="text-right">
                    Context Length
                  </Label>
                  <Select defaultValue="16k">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select context length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4k">4K tokens</SelectItem>
                      <SelectItem value="8k">8K tokens</SelectItem>
                      <SelectItem value="16k">16K tokens</SelectItem>
                      <SelectItem value="32k">32K tokens</SelectItem>
                      <SelectItem value="128k">128K tokens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Response Style</Label>
                  <div className="col-span-3 space-y-2">
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue placeholder="Select response style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="privacy" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Data Usage</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="improve-assistant" defaultChecked />
                      <Label htmlFor="improve-assistant">
                        Use conversations to improve assistant
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your conversations may be reviewed to improve our AI
                      models and services
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Data Retention</Label>
                  <div className="col-span-3 space-y-2">
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How long we store your conversation history
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Content Filtering</Label>
                  <div className="col-span-3 space-y-2">
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue placeholder="Select filtering level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="strict">Strict</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Controls filtering of potentially harmful or inappropriate
                      content
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Export Data</Label>
                  <div className="col-span-3">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Export Conversation
                      History
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Download all your conversation data in JSON format
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowSettingsDialog(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Assistant Templates</DialogTitle>
            <DialogDescription>
              Use pre-configured templates to quickly accomplish common tasks
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="md:col-span-1 space-y-4">
              <div className="relative">
                <Input placeholder="Search templates..." className="pl-8" />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  size="sm"
                >
                  All Categories
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  size="sm"
                >
                  Support
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal bg-muted"
                  size="sm"
                >
                  Marketing
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  size="sm"
                >
                  Productivity
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  size="sm"
                >
                  Development
                </Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Zap className="mr-2 h-4 w-4" /> Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowTemplatesDialog(false)}
            >
              Close
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integrations Dialog */}
      <Dialog
        open={showIntegrationsDialog}
        onOpenChange={setShowIntegrationsDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AI Assistant Integrations</DialogTitle>
            <DialogDescription>
              Connect your AI assistant with other tools and services
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      {integration.name}
                    </CardTitle>
                    <Switch checked={integration.connected} />
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!integration.connected}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Configure
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      integration.connected
                        ? "text-red-500 hover:text-red-600"
                        : "text-primary"
                    }
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowIntegrationsDialog(false)}
            >
              Close
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Custom Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistantPage;
