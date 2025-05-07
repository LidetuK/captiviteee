import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
  Clock,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  MessageCircle,
  Share2,
  BarChart2,
  Users,
  TrendingUp,
  Plus,
  MoreHorizontal,
} from "lucide-react";

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [postContent, setPostContent] = useState("");

  const socialAccounts = [
    {
      name: "Facebook",
      connected: true,
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
    },
    {
      name: "Twitter",
      connected: true,
      icon: <Twitter className="h-5 w-5 text-sky-500" />,
    },
    {
      name: "Instagram",
      connected: true,
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
    },
    {
      name: "LinkedIn",
      connected: false,
      icon: <Linkedin className="h-5 w-5 text-blue-700" />,
    },
  ];

  const scheduledPosts = [
    {
      id: 1,
      content:
        "Excited to announce our new AI-powered features launching next week! #Innovation #AI",
      date: "2023-11-15",
      time: "09:00 AM",
      platforms: ["Facebook", "Twitter", "Instagram"],
    },
    {
      id: 2,
      content:
        "Join our webinar on 'The Future of Business Automation' this Thursday at 2 PM EST. Register now at captivite.com/webinar",
      date: "2023-11-17",
      time: "10:30 AM",
      platforms: ["LinkedIn", "Twitter"],
    },
    {
      id: 3,
      content:
        "Customer spotlight: See how @TechInnovators increased engagement by 45% using our platform.",
      date: "2023-11-20",
      time: "03:15 PM",
      platforms: ["Twitter", "Facebook"],
    },
  ];

  const recentPosts = [
    {
      id: 1,
      platform: "Twitter",
      content:
        "Our AI scheduling assistant just got smarter! Now with predictive analytics to optimize your meeting times. #ProductUpdate",
      date: "2023-11-10",
      engagement: { likes: 45, comments: 12, shares: 8 },
      icon: <Twitter className="h-5 w-5 text-sky-500" />,
    },
    {
      id: 2,
      platform: "Facebook",
      content:
        "We're thrilled to be recognized as a leader in business automation software by @TechReview for the second year in a row! 🏆",
      date: "2023-11-08",
      engagement: { likes: 132, comments: 28, shares: 17 },
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
    },
    {
      id: 3,
      platform: "Instagram",
      content:
        "Behind the scenes at Captivite HQ: Our team working on the next generation of business automation tools.",
      date: "2023-11-05",
      engagement: { likes: 89, comments: 7, shares: 3 },
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
    },
  ];

  const insights = [
    {
      label: "Total Followers",
      value: "12,458",
      change: "+5.2%",
      icon: <Users className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Engagement Rate",
      value: "4.7%",
      change: "+0.8%",
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Reach",
      value: "45,892",
      change: "+12.3%",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    },
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle post submission logic here
    console.log("Post submitted:", postContent);
    setPostContent("");
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case "Twitter":
        return <Twitter className="h-4 w-4 text-sky-500" />;
      case "Instagram":
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case "LinkedIn":
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Media Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Connect Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {insight.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{insight.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  {insight.icon}
                </div>
              </div>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {insight.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>
                Compose and schedule your social media content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit}>
                <Textarea
                  placeholder="What would you like to share?"
                  className="min-h-[120px] mb-4"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  {socialAccounts.map((account, index) => (
                    <Button
                      key={index}
                      variant={account.connected ? "secondary" : "outline"}
                      size="sm"
                      className="flex items-center"
                    >
                      {account.icon}
                      <span className="ml-2">{account.name}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" /> Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" /> Add Media
                  </Button>
                  <Button type="submit" className="ml-auto">
                    <Send className="h-4 w-4 mr-2" /> Post Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                View and manage your scheduled posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{post.content}</p>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-3">{post.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-3">{post.time}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {post.platforms.map((platform, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center"
                        >
                          {getPlatformIcon(platform)}
                          <span className="ml-1">{platform}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Monitor engagement across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="mentions">Mentions</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="space-y-4 mt-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center">
                        {post.icon}
                        <span className="ml-2 font-medium">
                          {post.platform}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {post.date}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{post.content}</p>
                      <div className="flex items-center mt-3 space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>{post.engagement.shares}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="mentions" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <MessageCircle className="h-10 w-10 mb-2" />
                    <p>No new mentions in the last 7 days</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Last 30 days activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart2 className="h-16 w-16 text-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Top Platform</p>
                  <div className="flex items-center mt-1">
                    <Twitter className="h-5 w-5 text-sky-500 mr-2" />
                    <span className="font-medium">Twitter</span>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-medium">2PM - 4PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
