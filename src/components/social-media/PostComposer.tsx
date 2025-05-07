import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Image,
  Link,
  Smile,
  Clock,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SocialPlatform, SocialPost } from "@/types/social-media";

interface PostComposerProps {
  date: Date;
  onClose: () => void;
  onSubmit?: (post: Omit<SocialPost, 'id'>) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ date, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("compose");
  const [postContent, setPostContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(["facebook"]);
  const [title, setTitle] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isScheduled, setIsScheduled] = useState(true);

  const platforms: SocialPlatform[] = [
    "facebook",
    "twitter",
    "instagram",
    "linkedin",
    "tiktok",
  ];

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = () => {
    if (!title || !postContent) return;

    const [hours, minutes] = selectedTime.split(":");
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(parseInt(hours, 10));
    scheduledDate.setMinutes(parseInt(minutes, 10));

    const post: Omit<SocialPost, 'id'> = {
      title,
      content: postContent,
      platform: selectedPlatforms[0], // For now, just use the first selected platform
      time: selectedTime,
      status: isScheduled ? "scheduled" : "draft",
      scheduledFor: isScheduled ? scheduledDate : undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
    };

    onSubmit?.(post);
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your post content here..."
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform}
                    variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Label>Schedule Post</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
                <span>Schedule for later</span>
              </div>
            </div>

            {isScheduled && (
              <>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="space-y-2">
              <Label>Media URLs</Label>
              <div className="space-y-2">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...mediaUrls];
                        newUrls[index] = e.target.value;
                        setMediaUrls(newUrls);
                      }}
                      placeholder="Enter media URL"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        setMediaUrls(mediaUrls.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setMediaUrls([...mediaUrls, ""])}
                >
                  Add Media URL
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostComposer;
