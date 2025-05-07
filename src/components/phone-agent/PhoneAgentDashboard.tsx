import React, { useState, useEffect, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { phoneAgent } from "@/lib/ai/voice/phoneAgent";
import { callMonitor } from "@/lib/ai/voice/callMonitor";

import {
  AlertCircle,
  BarChart2,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  FileText,
  HelpCircle,
  History,
  Info,
  LayoutDashboard,
  MessageSquare,
  Mic,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOff,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  User,
  Users,
  Volume2,
  Wand2,
} from "lucide-react";

import {
  PhoneAgentConfig,
  CallMonitorConfig,
  CallSession,
  Alert as AlertType,
  Batch
} from "@/types";

type AllowedTone = "professional" | "friendly" | "casual" | "formal" | "empathetic";
type AllowedPace = "medium" | "slow" | "fast";
type AllowedVocabulary = "standard" | "simple" | "advanced";

interface Call {
  id: string;
  phoneNumber: string;
  status: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  callerId?: string;
}

interface Alert {
  id: string;
  type: string;
  severity: "high" | "medium" | "low" | "critical";
  message: string;
  timestamp: Date;
  status: "active" | "resolved" | "new" | "acknowledged";
  callId?: string;
}

// Mapping functions
const mapAgent = (a: unknown): PhoneAgentConfig => ({
  id: (a as any).id || "",
  name: (a as any).name || "",
  voice: {
    gender: (a as any).voice?.gender || "neutral",
    pitch: (a as any).voice?.pitch || 1.0,
    rate: (a as any).voice?.rate || 1.0,
  },
  personality: {
    tone: (a as any).personality?.tone || "professional",
    pace: (a as any).personality?.pace || "medium",
    vocabulary: (a as any).personality?.vocabulary || "standard",
  },
  compliance: {
    recordingDisclosure: (a as any).compliance?.recordingDisclosure || false,
    dataPrivacyStatements: (a as any).compliance?.dataPrivacyStatements || [],
    requiredDisclosures: (a as any).compliance?.requiredDisclosures || [],
    prohibitedPhrases: (a as any).compliance?.prohibitedPhrases || [],
    sensitiveTopics: (a as any).compliance?.sensitiveTopics || [],
  },
  createdAt: new Date((a as any).createdAt || Date.now()),
  updatedAt: new Date((a as any).updatedAt || Date.now()),
});

const mapMonitor = (m: unknown): CallMonitorConfig => ({
  id: (m as any).id || "",
  name: (m as any).name || "",
  type: (m as any).type || "",
  status: (m as any).status || "",
  createdAt: new Date((m as any).createdAt || Date.now()),
  updatedAt: new Date((m as any).updatedAt || Date.now()),
});

const mapCallSession = (c: unknown): CallSession => ({
  id: (c as any).id || "",
  phoneNumber: (c as any).phoneNumber || "",
  status: (c as any).status || "",
  duration: (c as any).duration || 0,
  startTime: new Date((c as any).startTime || Date.now()),
  endTime: (c as any).endTime ? new Date((c as any).endTime) : undefined,
  callerId: (c as any).callerId,
  agentId: (c as any).agentId || "",
  recordingUrl: (c as any).recordingUrl,
  transcript: (c as any).transcript || [],
  metrics: (c as any).metrics || {},
});

const mapAlert = (a: unknown): AlertType => ({
  id: (a as any).id || "",
  type: (a as any).type || "",
  severity: (a as any).severity || "medium",
  message: (a as any).message || "",
  timestamp: new Date((a as any).timestamp || Date.now()),
  status: (a as any).status || "new",
  callId: (a as any).callId,
});

export const PhoneAgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("agents");
  const [agents, setAgents] = useState<PhoneAgentConfig[]>([]);
  const [monitors, setMonitors] = useState<CallMonitorConfig[]>([]);
  const [activeCalls, setActiveCalls] = useState<CallSession[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentVoice, setNewAgentVoice] = useState<"neutral" | "female" | "male">("neutral");
  const [newAgentTone, setNewAgentTone] = useState<AllowedTone>("professional");
  const [newAgentVocabulary, setNewAgentVocabulary] = useState<AllowedVocabulary>("standard");
  const [newAgentPitch, setNewAgentPitch] = useState(1);
  const [newAgentRate, setNewAgentRate] = useState(1);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedMonitorId, setSelectedMonitorId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [batchPhoneNumbers, setBatchPhoneNumbers] = useState<string[]>([]);
  const [batchPhoneNumber, setBatchPhoneNumber] = useState("");
  const [batchProgress, setBatchProgress] = useState<Record<string, number>>({});
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallSession | null>(null);
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showNewBatchDialog, setShowNewBatchDialog] = useState(false);

  const getStatusBadge = (status: string): React.ReactNode => {
    const variants = {
      active: "success",
      idle: "secondary",
      error: "destructive",
      completed: "default",
      pending: "outline",
      processing: "outline",
      failed: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: "high" | "medium" | "low" | "critical"): React.ReactNode => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "default",
      critical: "destructive",
    } as const;

    return (
      <Badge variant={variants[severity] || "default"}>{severity}</Badge>
    );
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [agentsData, monitorsData, callsData] = await Promise.all([
        phoneAgent.getAllAgents(),
        callMonitor.getAllMonitors(),
        phoneAgent.getAllActiveCalls()
      ]);
      setAgents(agentsData.map(mapAgent));
      setMonitors(monitorsData.map(mapMonitor));
      setActiveCalls(callsData.map(mapCallSession));
      setAlerts([]); // Since there's no getAllAlerts method, we'll set an empty array for now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  // Filter calls based on status and search
  const filteredCalls = useMemo(() => {
    let filtered = activeCalls;
    if (filterStatus !== "all") {
      filtered = filtered.filter((call) => call.status === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.id.includes(searchQuery) ||
          ((call.callerId ?? "").toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  }, [activeCalls, filterStatus, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Rest of your JSX */}
    </div>
  );
};
