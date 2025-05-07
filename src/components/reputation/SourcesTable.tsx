import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, RefreshCw, Settings, Trash2 } from "lucide-react";
import type { ReviewSource } from "@/types/reputation";
import { reputationService } from "@/lib/reputation/reputationService";

interface SourcesTableProps {
  sources: ReviewSource[];
  onToggleSource?: (sourceId: string, enabled: boolean) => void;
  onDeleteSource?: (sourceId: string) => void;
  onEditSource?: (source: ReviewSource) => void;
  onSyncSource?: (sourceId: string) => void;
}

const SourcesTable: FC<SourcesTableProps> = ({
  sources = [],
  onToggleSource,
  onDeleteSource,
  onEditSource,
  onSyncSource,
}) => {
  const getSourceTypeIcon = (type: ReviewSource["type"]) => {
    return (
      <Badge variant="outline" className="font-normal">
        {type}
      </Badge>
    );
  };

  const formatSyncFrequency = (frequency: ReviewSource["syncFrequency"]) => {
    switch (frequency) {
      case "hourly":
        return "Every hour";
      case "daily":
        return "Once a day";
      case "weekly":
        return "Once a week";
      case "never":
        return "Manual only";
      default:
        return "Manual only";
    }
  };

  const handleToggleSource = async (sourceId: string, enabled: boolean) => {
    try {
      await reputationService.updateSource(sourceId, { enabled });
      onToggleSource?.(sourceId, enabled);
    } catch (error) {
      console.error("Failed to toggle source:", error);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    try {
      await reputationService.deleteSource(sourceId);
      onDeleteSource?.(sourceId);
    } catch (error) {
      console.error("Failed to delete source:", error);
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    try {
      // In a real implementation, this would trigger a sync
      onSyncSource?.(sourceId);
    } catch (error) {
      console.error("Failed to sync source:", error);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Sync Frequency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>{getSourceTypeIcon(source.type)}</TableCell>
              <TableCell>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {source.url}
                </a>
              </TableCell>
              <TableCell>{formatSyncFrequency(source.syncFrequency)}</TableCell>
              <TableCell>
                <Switch
                  checked={source.enabled}
                  onCheckedChange={(checked) =>
                    handleToggleSource(source.id, checked)
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSyncSource(source.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditSource?.(source)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SourcesTable;
