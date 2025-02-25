import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface VideoTutorialProps {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  thumbnail?: string;
}

export default function VideoTutorial({
  title,
  description,
  videoUrl,
  duration,
  thumbnail,
}: VideoTutorialProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        <video
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/90"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/90"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/90"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <span className="text-sm">{duration}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
