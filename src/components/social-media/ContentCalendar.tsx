import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PostComposer from "./PostComposer";
import { SocialPost, CalendarDay, SocialPlatform, PostStatus } from "@/types/social-media";

const ContentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showComposer, setShowComposer] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar data
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Calendar array with 6 weeks (42 days) to ensure we have enough space
    const calendarDays: CalendarDay[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push({ day: null, date: null, posts: [] });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({
        day,
        date,
        posts: generateMockPosts(date),
      });
    }

    return calendarDays;
  };

  // Mock data generator for posts
  const generateMockPosts = (date: Date): SocialPost[] => {
    // Generate 0-3 mock posts for each day
    const numPosts = Math.floor(Math.random() * 4);
    if (numPosts === 0) return [];

    const posts: SocialPost[] = [];
    const platforms: SocialPlatform[] = [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "tiktok",
    ];

    const titles = [
      "New Product Announcement",
      "Customer Success Story",
      "Industry News",
      "Tips & Tricks",
    ];

    for (let i = 0; i < numPosts; i++) {
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      const status: PostStatus = Math.random() > 0.2 ? "scheduled" : "draft";
      
      posts.push({
        id: `post-${date.getTime()}-${i}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        platform: randomPlatform,
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? "30" : "00"} ${Math.random() > 0.5 ? "AM" : "PM"}`,
        status,
        scheduledFor: status === "scheduled" ? date : undefined,
      });
    }

    return posts;
  };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowComposer(true);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "facebook":
        return "fb";
      case "twitter":
        return "tw";
      case "instagram":
        return "ig";
      case "linkedin":
        return "li";
      case "tiktok":
        return "tt";
      default:
        return platform;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <Button variant="outline" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold py-2">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`border p-2 min-h-[100px] ${
                day.day === null ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer"
              }`}
              onClick={() => day.date && handleDayClick(day.date)}
            >
              {day.day && (
                <>
                  <div className="font-semibold">{day.day}</div>
                  {day.posts.map((post) => (
                    <div
                      key={post.id}
                      className="text-xs mt-1 p-1 rounded"
                      style={{
                        backgroundColor: `var(--${post.platform}-bg)`,
                        color: `var(--${post.platform}-text)`,
                      }}
                    >
                      {getPlatformIcon(post.platform)}: {post.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        {showComposer && selectedDate && (
          <PostComposer
            date={selectedDate}
            onClose={() => {
              setShowComposer(false);
              setSelectedDate(null);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCalendar;
