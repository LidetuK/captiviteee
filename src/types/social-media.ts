export type SocialPlatform = "facebook" | "twitter" | "instagram" | "linkedin" | "tiktok";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface SocialPost {
  id: string;
  title: string;
  platform: SocialPlatform;
  time: string;
  status: PostStatus;
  content?: string;
  mediaUrls?: string[];
  scheduledFor?: Date;
  publishedAt?: Date;
  metrics?: {
    likes?: number;
    shares?: number;
    comments?: number;
    reach?: number;
    engagement?: number;
  };
}

export interface CalendarDay {
  day: number | null;
  date: Date | null;
  posts: SocialPost[];
} 