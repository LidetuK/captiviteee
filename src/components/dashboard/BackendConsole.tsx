import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Terminal,
  Play,
  Pause,
  RefreshCw,
  Save,
  Download,
  Upload,
  Code,
  Database,
  Server,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Lock,
  Mail,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  BarChart,
  Zap,
  Shield,
  Info,
  BrainCircuit,
  Bot,
  Sparkles,
  Lightbulb,
  Workflow,
  Layers,
  Gauge,
  LineChart,
  PieChart,
  BarChart3,
  ArrowRight,
  MessageSquare,
  Users,
  FileText,
  Rocket,
  Wand2,
} from "lucide-react";
import { Label } from "@/components/ui/label";

const BackendConsole = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRunning, setIsRunning] = useState(true);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [logLevel, setLogLevel] = useState("all");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 32,
    memory: 45,
    disk: 28,
    network: 65,
    aiUsage: 58,
    automationEfficiency: 87,
  });
  const [savedQueries, setSavedQueries] = useState([
    { id: 1, name: "List all users", query: "SELECT * FROM users LIMIT 10;" },
    {
      id: 2,
      name: "Recent transactions",
      query: "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 20;",
    },
    {
      id: 3,
      name: "System health",
      query: "SELECT service_name, status, last_check FROM service_health;",
    },
  ]);

  // Mock logs data
  const logs = [
    {
      id: 1,
      timestamp: "2023-10-15 14:32:45",
      level: "info",
      message: "AI Engine initialized with enhanced NLP capabilities",
      service: "ai-engine",
    },
    {
      id: 2,
      timestamp: "2023-10-15 14:33:12",
      level: "info",
      message: "Connected to database with optimized query patterns",
      service: "database",
    },
    {
      id: 3,
      timestamp: "2023-10-15 14:33:30",
      level: "info",
      message:
        "User authentication service initialized with biometric verification",
      service: "auth",
    },
    {
      id: 4,
      timestamp: "2023-10-15 14:34:15",
      level: "warning",
      message:
        "High memory usage detected - AI models optimizing resource allocation",
      service: "monitoring",
    },
    {
      id: 5,
      timestamp: "2023-10-15 14:35:22",
      level: "error",
      message:
        "Failed to process payment for user #1234 - Automated recovery initiated",
      service: "payment",
    },
    {
      id: 6,
      timestamp: "2023-10-15 14:36:05",
      level: "info",
      message:
        "Scheduled task started: Intelligent database optimization and backup",
      service: "scheduler",
    },
    {
      id: 7,
      timestamp: "2023-10-15 14:37:18",
      level: "debug",
      message: "Processing request with context-aware routing: GET /api/users",
      service: "api",
    },
    {
      id: 8,
      timestamp: "2023-10-15 14:38:30",
      level: "info",
      message: "Personalized email notification sent to user@example.com",
      service: "notifications",
    },
    {
      id: 9,
      timestamp: "2023-10-15 14:39:45",
      level: "warning",
      message:
        "API rate limit approaching - Dynamic scaling initiated for client #5678",
      service: "api",
    },
    {
      id: 10,
      timestamp: "2023-10-15 14:40:12",
      level: "error",
      message:
        "Database query timeout after 30s - Query optimizer analyzing patterns",
      service: "database",
    },
    {
      id: 11,
      timestamp: "2023-10-15 14:41:05",
      level: "info",
      message:
        "New user registered: AI onboarding sequence initiated for john.doe@example.com",
      service: "auth",
    },
    {
      id: 12,
      timestamp: "2023-10-15 14:42:33",
      level: "debug",
      message: "Predictive cache optimization: Hit ratio improved to 92.5%",
      service: "cache",
    },
  ];

  // Update system status periodically
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        cpu: Math.min(
          100,
          Math.max(
            5,
            prev.cpu + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5,
          ),
        ),
        memory: Math.min(
          100,
          Math.max(
            10,
            prev.memory + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 3,
          ),
        ),
        disk: Math.min(
          100,
          Math.max(
            15,
            prev.disk + (Math.random() > 0.5 ? 0.2 : -0.1) * Math.random(),
          ),
        ),
        network: Math.min(
          100,
          Math.max(
            5,
            prev.network + (Math.random() > 0.5 ? 2 : -2) * Math.random() * 8,
          ),
        ),
        aiUsage: Math.min(
          100,
          Math.max(
            30,
            prev.aiUsage + (Math.random() > 0.5 ? 1.5 : -1) * Math.random() * 4,
          ),
        ),
        automationEfficiency: Math.min(
          100,
          Math.max(
            70,
            prev.automationEfficiency +
              (Math.random() > 0.7 ? 0.5 : -0.3) * Math.random() * 2,
          ),
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Execute query
  const executeQuery = () => {
    if (!query.trim()) return;

    setIsExecuting(true);
    setQueryResult(null);

    // Simulate query execution
    setTimeout(() => {
      if (query.toLowerCase().includes("select")) {
        setQueryResult(
          JSON.stringify(
            [
              {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                created_at: "2023-10-15T10:30:00Z",
                ai_sentiment_score: 0.87,
                engagement_level: "high",
              },
              {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                created_at: "2023-10-14T08:45:00Z",
                ai_sentiment_score: 0.92,
                engagement_level: "medium",
              },
              {
                id: 3,
                name: "Bob Johnson",
                email: "bob@example.com",
                created_at: "2023-10-13T14:20:00Z",
                ai_sentiment_score: 0.76,
                engagement_level: "low",
              },
            ],
            null,
            2,
          ),
        );
      } else if (
        query.toLowerCase().includes("insert") ||
        query.toLowerCase().includes("update")
      ) {
        setQueryResult(
          "Query executed successfully. AI optimization applied. Affected rows: 1",
        );
      } else {
        setQueryResult(
          "Query executed successfully with intelligent query optimization.",
        );
      }
      setIsExecuting(false);
    }, 1500);
  };

  // Save current query
  const saveCurrentQuery = () => {
    if (!query.trim()) return;

    const newQuery = {
      id: savedQueries.length + 1,
      name: `Query ${savedQueries.length + 1}`,
      query: query,
    };

    setSavedQueries([...savedQueries, newQuery]);
  };

  // Load a saved query
  const loadQuery = (savedQuery: {
    id: number;
    name: string;
    query: string;
  }) => {
    setQuery(savedQuery.query);
  };

  // Filter logs based on search input and selected log level
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.service.toLowerCase().includes(filter.toLowerCase()) ||
      log.level.toLowerCase().includes(filter.toLowerCase());

    const matchesLevel = logLevel === "all" || log.level === logLevel;

    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">{level}</Badge>;
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            {level}
          </Badge>
        );
      case "info":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            {level}
          </Badge>
        );
      case "debug":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            {level}
          </Badge>
        );
      default:
        return <Badge>{level}</Badge>;
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Terminal className="mr-2 h-5 w-5" /> AI-Powered Backend Console
            </CardTitle>
            <CardDescription>
              Intelligent monitoring and management of your backend services
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRunning ? "Pause monitoring" : "Resume monitoring"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh data</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download logs</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Console settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-4">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Gauge className="mr-2 h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <Terminal className="mr-2 h-4 w-4" /> Logs
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center">
              <Database className="mr-2 h-4 w-4" /> Query
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Server className="mr-2 h-4 w-4" /> Services
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center">
              <BrainCircuit className="mr-2 h-4 w-4" /> AI Center
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center">
              <Workflow className="mr-2 h-4 w-4" /> Automation
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" /> Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">
                          System Health
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-500">
                        Excellent
                      </span>
                    </div>
                    <Progress value={92} className="h-2 mb-4" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">CPU</span>
                        <div className="flex justify-between">
                          <span>{systemStatus.cpu.toFixed(1)}%</span>
                          <span className="text-green-500">Normal</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Memory</span>
                        <div className="flex justify-between">
                          <span>{systemStatus.memory.toFixed(1)}%</span>
                          <span className="text-green-500">Normal</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">
                          AI Performance
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-500">
                        Optimized
                      </span>
                    </div>
                    <Progress
                      value={systemStatus.aiUsage}
                      className="h-2 mb-4"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Model Latency
                        </span>
                        <div className="flex justify-between">
                          <span>124ms</span>
                          <span className="text-blue-500">Fast</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Accuracy</span>
                        <div className="flex justify-between">
                          <span>97.8%</span>
                          <span className="text-blue-500">High</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Workflow className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Automation</span>
                      </div>
                      <span className="text-sm font-bold text-purple-500">
                        Active
                      </span>
                    </div>
                    <Progress
                      value={systemStatus.automationEfficiency}
                      className="h-2 mb-4"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Workflows</span>
                        <div className="flex justify-between">
                          <span>24 active</span>
                          <span className="text-purple-500">Running</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Efficiency
                        </span>
                        <div className="flex justify-between">
                          <span>
                            {systemStatus.automationEfficiency.toFixed(1)}%
                          </span>
                          <span className="text-purple-500">High</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Activity</CardTitle>
                    <CardDescription>
                      Real-time performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] bg-muted/20 rounded-md flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Events</CardTitle>
                    <CardDescription>System notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-4">
                        {logs.slice(0, 5).map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <div className="mt-0.5">
                              {log.level === "info" && (
                                <Info className="h-4 w-4 text-blue-500" />
                              )}
                              {log.level === "warning" && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                              {log.level === "error" && (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{log.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Active Users</p>
                          <p className="text-2xl font-bold">1,248</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        +12.5%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="text-sm font-medium">API Requests</p>
                          <p className="text-2xl font-bold">24.5k</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        +8.3%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Error Rate</p>
                          <p className="text-2xl font-bold">0.8%</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        -0.2%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Rocket className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="text-sm font-medium">AI Predictions</p>
                          <p className="text-2xl font-bold">98.7%</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800"
                      >
                        +1.2%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <div className="flex items-center space-x-2 mb-4">
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  placeholder="Filter logs..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="bg-muted p-2 text-xs font-medium grid grid-cols-12 gap-4">
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-1">Level</div>
                <div className="col-span-2">Service</div>
                <div className="col-span-7">Message</div>
              </div>
              <ScrollArea className="h-[400px]">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 text-sm border-t grid grid-cols-12 gap-4 hover:bg-muted/50"
                  >
                    <div className="col-span-2 font-mono text-xs">
                      {log.timestamp}
                    </div>
                    <div className="col-span-1">{getLevelBadge(log.level)}</div>
                    <div className="col-span-2">
                      <Badge variant="outline">{log.service}</Badge>
                    </div>
                    <div className="col-span-7 font-mono text-xs">
                      {log.message}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="query" className="mt-0">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Enter SQL query or command..."
                    className="font-mono text-sm h-32"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="w-64 border rounded-md">
                  <div className="p-2 bg-muted font-medium text-sm flex justify-between items-center">
                    <span>Saved Queries</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[112px]">
                    <div className="p-2 space-y-1">
                      {savedQueries.map((savedQuery) => (
                        <div
                          key={savedQuery.id}
                          className="text-xs p-1.5 rounded hover:bg-muted cursor-pointer flex justify-between items-center"
                          onClick={() => loadQuery(savedQuery)}
                        >
                          <span className="font-medium truncate">
                            {savedQuery.name}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button
                    variant="default"
                    onClick={executeQuery}
                    disabled={isExecuting || !query.trim()}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" /> Execute
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={saveCurrentQuery}
                    disabled={!query.trim()}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Query
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Wand2 className="mr-2 h-4 w-4" /> AI Optimize
                  </Button>
                  <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 h-64 bg-muted/50 font-mono text-sm overflow-auto">
                {isExecuting ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Executing query with AI optimization...</span>
                  </div>
                ) : queryResult ? (
                  <pre className="whitespace-pre-wrap">{queryResult}</pre>
                ) : (
                  <div className="text-muted-foreground">
                    Query results will appear here...
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "API Gateway",
                  status: "running",
                  icon: <Code />,
                  uptime: "5d 12h 34m",
                  memory: "128MB",
                  cpu: "2.3%",
                  aiEnhanced: true,
                },
                {
                  name: "Database Cluster",
                  status: "running",
                  icon: <Database />,
                  uptime: "12d 5h 12m",
                  memory: "256MB",
                  cpu: "5.7%",
                  aiEnhanced: true,
                },
                {
                  name: "Cache Service",
                  status: "running",
                  icon: <Server />,
                  uptime: "5d 12h 30m",
                  memory: "64MB",
                  cpu: "1.2%",
                  aiEnhanced: true,
                },
                {
                  name: "Authentication Service",
                  status: "running",
                  icon: <Lock />,
                  uptime: "5d 12h 34m",
                  memory: "96MB",
                  cpu: "1.8%",
                  aiEnhanced: true,
                },
                {
                  name: "Email Service",
                  status: "warning",
                  icon: <Mail />,
                  uptime: "3d 7h 22m",
                  memory: "48MB",
                  cpu: "0.9%",
                  aiEnhanced: false,
                },
                {
                  name: "Background Worker",
                  status: "error",
                  icon: <Settings />,
                  uptime: "0d 1h 5m",
                  memory: "0MB",
                  cpu: "0%",
                  aiEnhanced: false,
                },
              ].map((service) => (
                <Card key={service.name} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-2 p-1.5 rounded-md bg-primary/10">
                          {service.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {service.name}
                            {service.aiEnhanced && (
                              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" /> AI
                                Enhanced
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      {service.status === "running" && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Running
                        </Badge>
                      )}
                      {service.status === "warning" && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                        </Badge>
                      )}
                      {service.status === "error" && (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 border-red-200"
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Error
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-medium">{service.uptime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Memory</p>
                        <p className="font-medium">{service.memory}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CPU</p>
                        <p className="font-medium">{service.cpu}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      {service.status === "error" ? (
                        <Button variant="default" size="sm">
                          <Wand2 className="mr-2 h-3 w-3" /> Auto-Repair
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-3 w-3" /> Restart
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-3 w-3" /> Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <BrainCircuit className="h-4 w-4 mr-2 text-primary" /> AI
                      Models
                    </CardTitle>
                    <CardDescription>
                      Deployed machine learning models
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Customer Intent Classifier",
                          type: "NLP",
                          status: "active",
                          accuracy: "97.8%",
                          lastTrained: "2 days ago",
                        },
                        {
                          name: "Sentiment Analysis",
                          type: "NLP",
                          status: "active",
                          accuracy: "94.2%",
                          lastTrained: "1 week ago",
                        },
                        {
                          name: "Anomaly Detection",
                          type: "Time Series",
                          status: "active",
                          accuracy: "96.5%",
                          lastTrained: "3 days ago",
                        },
                        {
                          name: "Content Recommendation",
                          type: "Recommendation",
                          status: "training",
                          accuracy: "92.1%",
                          lastTrained: "in progress",
                        },
                      ].map((model) => (
                        <div
                          key={model.name}
                          className="flex justify-between items-center p-2 border rounded-md hover:bg-muted/50"
                        >
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {model.type}
                              </Badge>
                              Accuracy: {model.accuracy}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {model.status === "active" ? (
                              <Badge className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800">
                                Training
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Deploy New Model
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-primary" /> AI
                      Performance
                    </CardTitle>
                    <CardDescription>
                      Real-time AI system metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Inference Latency</span>
                          <span className="text-sm font-medium">124ms</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Model Accuracy</span>
                          <span className="text-sm font-medium">97.8%</span>
                        </div>
                        <Progress value={97.8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">GPU Utilization</span>
                          <span className="text-sm font-medium">78.3%</span>
                        </div>
                        <Progress value={78.3} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Cache Hit Rate</span>
                          <span className="text-sm font-medium">92.5%</span>
                        </div>
                        <Progress value={92.5} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-muted/30 rounded-md">
                      <div className="flex items-center">
                        <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">AI Insight</p>
                          <p className="text-xs text-muted-foreground">
                            Reducing batch size could improve latency by ~15%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-primary" /> AI Usage
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    How AI is being utilized across your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                      <PieChart className="h-12 w-12 text-primary/20" />
                    </div>
                    <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-primary/20" />
                    </div>
                    <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                      <LineChart className="h-12 w-12 text-primary/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-0">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Automation Workflows</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered automation pipelines
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Workflow
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    name: "Customer Onboarding",
                    status: "active",
                    type: "User Management",
                    lastRun: "10 minutes ago",
                    steps: 8,
                    aiEnhanced: true,
                  },
                  {
                    id: 2,
                    name: "Data Backup & Optimization",
                    status: "active",
                    type: "System",
                    lastRun: "2 hours ago",
                    steps: 5,
                    aiEnhanced: true,
                  },
                  {
                    id: 3,
                    name: "Content Moderation",
                    status: "active",
                    type: "Content",
                    lastRun: "15 minutes ago",
                    steps: 4,
                    aiEnhanced: true,
                  },
                  {
                    id: 4,
                    name: "Anomaly Detection & Alert",
                    status: "active",
                    type: "Security",
                    lastRun: "1 hour ago",
                    steps: 6,
                    aiEnhanced: true,
                  },
                  {
                    id: 5,
                    name: "Report Generation",
                    status: "paused",
                    type: "Analytics",
                    lastRun: "1 day ago",
                    steps: 3,
                    aiEnhanced: false,
                  },
                  {
                    id: 6,
                    name: "Email Campaign",
                    status: "draft",
                    type: "Marketing",
                    lastRun: "Never",
                    steps: 7,
                    aiEnhanced: false,
                  },
                ].map((workflow) => (
                  <Card key={workflow.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            {workflow.name}
                            {workflow.aiEnhanced && (
                              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" /> AI
                                Enhanced
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{workflow.type}</CardDescription>
                        </div>
                        {workflow.status === "active" && (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                        {workflow.status === "paused" && (
                          <Badge className="bg-amber-100 text-amber-800">
                            Paused
                          </Badge>
                        )}
                        {workflow.status === "draft" && (
                          <Badge className="bg-gray-100 text-gray-800">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Last Run</p>
                          <p className="font-medium">{workflow.lastRun}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Steps</p>
                          <p className="font-medium">{workflow.steps} steps</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {workflow.status === "active" ? (
                          <Button variant="outline" size="sm">
                            <Pause className="mr-2 h-3 w-3" /> Pause
                          </Button>
                        ) : workflow.status === "paused" ? (
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 h-3 w-3" /> Resume
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 h-3 w-3" /> Activate
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Workflow className="h-4 w-4 mr-2 text-primary" />{" "}
                    Automation Insights
                  </CardTitle>
                  <CardDescription>
                    AI-generated recommendations to improve your workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Optimize Customer Onboarding
                          </p>
                          <p className="text-xs text-blue-700">
                            Adding sentiment analysis to the welcome email step
                            could increase engagement by 23% based on historical
                            data.
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 px-0 text-blue-700"
                          >
                            Apply Recommendation{" "}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-800">
                            Enhance Data Backup
                          </p>
                          <p className="text-xs text-purple-700">
                            Implementing predictive compression could reduce
                            storage costs by approximately 18%.
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 px-0 text-purple-700"
                          >
                            Apply Recommendation{" "}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            New Workflow Opportunity
                          </p>
                          <p className="text-xs text-green-700">
                            Based on user behavior patterns, an automated
                            content recommendation workflow could increase user
                            engagement by 31%.
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 px-0 text-green-700"
                          >
                            Create Workflow{" "}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-primary" />{" "}
                      Environment Variables
                    </CardTitle>
                    <CardDescription>
                      Manage application environment settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="show-sensitive"
                          className="text-sm cursor-pointer"
                        >
                          Show sensitive values
                        </Label>
                        <Switch
                          id="show-sensitive"
                          checked={showSensitive}
                          onCheckedChange={setShowSensitive}
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Variables</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="ai">AI Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {[
                          {
                            key: "NODE_ENV",
                            value: "production",
                            sensitive: false,
                            type: "system",
                          },
                          {
                            key: "PORT",
                            value: "3000",
                            sensitive: false,
                            type: "system",
                          },
                          {
                            key: "DATABASE_URL",
                            value: "postgres://user:password123@host:5432/db",
                            sensitive: true,
                            type: "database",
                          },
                          {
                            key: "REDIS_URL",
                            value: "redis://127.0.0.1:6379",
                            sensitive: false,
                            type: "database",
                          },
                          {
                            key: "API_KEY",
                            value: "sk_live_51NzKLpCYgESxYlLrIUkdvUVYt2fEZEI",
                            sensitive: true,
                            type: "api",
                          },
                          {
                            key: "JWT_SECRET",
                            value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                            sensitive: true,
                            type: "security",
                          },
                          {
                            key: "SMTP_PASSWORD",
                            value: "mailserver123",
                            sensitive: true,
                            type: "system",
                          },
                          {
                            key: "AI_MODEL_ENDPOINT",
                            value: "https://api.openai.com/v1",
                            sensitive: false,
                            type: "ai",
                          },
                          {
                            key: "AI_API_KEY",
                            value: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
                            sensitive: true,
                            type: "ai",
                          },
                        ].map((env) => (
                          <div
                            key={env.key}
                            className="flex justify-between items-center p-2 border rounded-md hover:bg-muted/50"
                          >
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {env.type}
                              </Badge>
                              <div className="font-mono text-sm">{env.key}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="font-mono text-sm mr-2">
                                {env.sensitive && !showSensitive
                                  ? "••••••••••••"
                                  : env.value}
                              </div>
                              <div className="flex space-x-1">
                                {env.sensitive && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      setShowSensitive(!showSensitive)
                                    }
                                  >
                                    {showSensitive ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Plus className="mr-2 h-4 w-4" /> Add Variable
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Upload className="mr-2 h-4 w-4" /> Import from .env
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-primary" /> API
                      Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure API settings and limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Rate Limit</Label>
                          <div className="flex">
                            <Input defaultValue="100" />
                            <Select defaultValue="minute">
                              <SelectTrigger className="w-[110px] ml-2">
                                <SelectValue placeholder="Per" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="second">
                                  Per Second
                                </SelectItem>
                                <SelectItem value="minute">
                                  Per Minute
                                </SelectItem>
                                <SelectItem value="hour">Per Hour</SelectItem>
                                <SelectItem value="day">Per Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Timeout (ms)</Label>
                          <Input defaultValue="30000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Payload Size</Label>
                          <Input defaultValue="10MB" />
                        </div>
                        <div className="space-y-2">
                          <Label>Cache TTL</Label>
                          <div className="flex">
                            <Input defaultValue="3600" />
                            <Select defaultValue="seconds">
                              <SelectTrigger className="w-[110px] ml-2">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="seconds">Seconds</SelectItem>
                                <SelectItem value="minutes">Minutes</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="cors-enabled"
                            className="cursor-pointer"
                          >
                            Enable CORS
                          </Label>
                          <Switch id="cors-enabled" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="rate-limiting"
                            className="cursor-pointer"
                          >
                            Rate Limiting
                          </Label>
                          <Switch id="rate-limiting" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="request-logging"
                            className="cursor-pointer"
                          >
                            Request Logging
                          </Label>
                          <Switch id="request-logging" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="ai-optimization"
                            className="cursor-pointer"
                          >
                            AI Query Optimization
                          </Label>
                          <Switch id="ai-optimization" defaultChecked />
                        </div>
                      </div>

                      <Button className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Save Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-2 text-primary" /> AI
                    Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure AI services and model settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default Language Model</Label>
                        <Select defaultValue="gpt4">
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="claude">
                              Claude 3 Opus
                            </SelectItem>
                            <SelectItem value="llama">Llama 3 70B</SelectItem>
                            <SelectItem value="mistral">
                              Mistral Large
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Embedding Model</Label>
                        <Select defaultValue="text-embedding-3-large">
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-embedding-3-large">
                              OpenAI Text Embedding 3 Large
                            </SelectItem>
                            <SelectItem value="text-embedding-3-small">
                              OpenAI Text Embedding 3 Small
                            </SelectItem>
                            <SelectItem value="cohere">
                              Cohere Embed v3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Model Temperature</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">0.0</span>
                          <Input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            defaultValue="0.7"
                            className="flex-1"
                          />
                          <span className="text-xs">1.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BackendConsole;
