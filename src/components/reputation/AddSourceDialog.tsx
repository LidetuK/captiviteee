import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import type { ReviewSource } from "@/types/reputation";

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (source: Omit<ReviewSource, "id">) => void;
}

const AddSourceDialog: FC<AddSourceDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [source, setSource] = useState<Omit<ReviewSource, "id">>({
    name: "",
    type: "google",
    url: "",
    enabled: true,
    syncFrequency: "daily",
    credentials: {},
  });

  const handleChange = (field: keyof typeof source, value: any) => {
    setSource((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(source);
    setSource({
      name: "",
      type: "google",
      url: "",
      enabled: true,
      syncFrequency: "daily",
      credentials: {},
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Review Source</DialogTitle>
          <DialogDescription>
            Configure a new source for collecting reviews
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={source.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Google My Business"
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={source.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="yelp">Yelp</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>URL</Label>
            <Input
              value={source.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="e.g., https://www.google.com/business"
            />
          </div>

          <div>
            <Label>Sync Frequency</Label>
            <Select
              value={source.syncFrequency}
              onValueChange={(value) => handleChange("syncFrequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sync frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={source.enabled}
              onCheckedChange={(checked) => handleChange("enabled", checked)}
            />
            <Label>Enabled</Label>
          </div>

          <div>
            <Label>API Key (Optional)</Label>
            <Input
              value={source.credentials?.apiKey || ""}
              onChange={(e) =>
                handleChange("credentials", {
                  ...source.credentials,
                  apiKey: e.target.value,
                })
              }
              placeholder="Enter API key if required"
              type="password"
            />
          </div>

          <div>
            <Label>Username (Optional)</Label>
            <Input
              value={source.credentials?.username || ""}
              onChange={(e) =>
                handleChange("credentials", {
                  ...source.credentials,
                  username: e.target.value,
                })
              }
              placeholder="Enter username if required"
            />
          </div>

          <div>
            <Label>Password (Optional)</Label>
            <Input
              value={source.credentials?.password || ""}
              onChange={(e) =>
                handleChange("credentials", {
                  ...source.credentials,
                  password: e.target.value,
                })
              }
              placeholder="Enter password if required"
              type="password"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!source.name || !source.url}
          >
            Add Source
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSourceDialog;
