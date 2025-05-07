import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Image,
  FileText,
  Video,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";

const ContentLibrary = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Mock content items
  const contentItems = [
    {
      id: 1,
      title: "Product Launch Announcement",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80",
      tags: ["product", "announcement", "marketing"],
      used: 3,
      created: "2023-10-15",
    },
    {
      id: 2,
      title: "Customer Testimonial Video",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=500&q=80",
      tags: ["testimonial", "customer", "video"],
      used: 5,
      created: "2023-10-10",
    },
    {
      id: 3,
      title: "Weekly Tips Template",
      type: "template",
      thumbnail:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80",
      tags: ["tips", "weekly", "template"],
      used: 12,
      created: "2023-09-28",
    },
    {
      id: 4,
      title: "Team Photo",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
      tags: ["team", "company", "people"],
      used: 7,
      created: "2023-09-15",
    },
    {
      id: 5,
      title: "Product Demo",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&q=80",
      tags: ["product", "demo", "tutorial"],
      used: 4,
      created: "2023-09-05",
    },
    {
      id: 6,
      title: "Company Blog Post",
      type: "article",
      thumbnail:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80",
      tags: ["blog", "article", "company"],
      used: 2,
      created: "2023-08-22",
    },
    {
      id: 7,
      title: "Holiday Promotion",
      type: "template",
      thumbnail:
        "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80",
      tags: ["holiday", "promotion", "seasonal"],
      used: 0,
      created: "2023-08-10",
    },
    {
      id: 8,
      title: "Product Features Infographic",
      type: "image",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80",
      tags: ["infographic", "product", "features"],
      used: 6,
      created: "2023-07-28",
    },
  ];

  // Filter content based on active tab
  const filteredContent = contentItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "template":
        return <Copy className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Library</h2>
          <p className="text-muted-foreground">
            Manage and organize your social media content
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Content
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-8" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-used">Most Used</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 rounded-md p-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-background/80 rounded-md p-1">
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>Used {item.used} times</span>
                      <span>{new Date(item.created).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                <div className="col-span-5">Content</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2">Usage</div>
                <div className="col-span-1">Actions</div>
              </div>
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 p-3 border-t items-center"
                >
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center space-x-1">
                    {getTypeIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="col-span-2">
                    {new Date(item.created).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">Used {item.used} times</div>
                  <div className="col-span-1 flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-center text-muted-foreground mb-1">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-center text-muted-foreground">
                Supports images, videos, and documents up to 50MB
              </p>
              <Button variant="outline" className="mt-4">
                Select Files
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-title">Title</Label>
              <Input
                id="content-title"
                placeholder="Enter a title for your content"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-tags">Tags</Label>
              <Input
                id="content-tags"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-description">
                Description (optional)
              </Label>
              <Textarea
                id="content-description"
                placeholder="Add a description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select defaultValue="template">
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">
                    Social Media Template
                  </SelectItem>
                  <SelectItem value="article">Article or Blog Post</SelectItem>
                  <SelectItem value="ai-generated">
                    AI-Generated Content
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-title">Title</Label>
              <Input id="template-title" placeholder="Enter a title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-content">Content</Label>
              <Textarea
                id="template-content"
                placeholder="Enter your template content. Use {variable} for dynamic content."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Variables</Label>
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Variable name"
                    className="flex-1"
                    defaultValue="product_name"
                  />
                  <Input
                    placeholder="Default value"
                    className="flex-1"
                    defaultValue="Our Product"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Variable name"
                    className="flex-1"
                    defaultValue="discount"
                  />
                  <Input
                    placeholder="Default value"
                    className="flex-1"
                    defaultValue="20%"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Variable
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-tags">Tags</Label>
              <Input
                id="template-tags"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="add-to-library" />
              <Label htmlFor="add-to-library" className="text-sm font-normal">
                Add to content library for future use
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button>Create Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentLibrary;
