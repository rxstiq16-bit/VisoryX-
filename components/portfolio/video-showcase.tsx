"use client";

import { useState } from "react";
import { Play, X, ExternalLink, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  duration: string;
}

const showcaseVideos: VideoItem[] = [
  {
    id: "1",
    title: "ERLC Livery Design Timelapse",
    description: "Watch the full creation process of a custom LEO livery pack from start to finish.",
    thumbnail: "/placeholder-video-1.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Timelapse",
    duration: "3:45",
  },
  {
    id: "2",
    title: "Discord Server Setup Walkthrough",
    description: "Tour of a fully configured premium Discord server with 50+ channels.",
    thumbnail: "/placeholder-video-2.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Showcase",
    duration: "5:20",
  },
  {
    id: "3",
    title: "Logo Design Process",
    description: "From concept sketches to final polished logo - the creative journey.",
    thumbnail: "/placeholder-video-3.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Behind the Scenes",
    duration: "4:10",
  },
  {
    id: "4",
    title: "Client Livery Reveal",
    description: "Revealing the final livery pack to a satisfied client in real-time.",
    thumbnail: "/placeholder-video-4.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Reveal",
    duration: "2:30",
  },
];

export function VideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Video Showcases
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {showcaseVideos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer overflow-hidden transition-colors hover:border-primary/50"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                  <div className="rounded-full bg-white/90 p-3 transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 text-foreground fill-foreground ml-0.5" />
                  </div>
                </div>
                <Badge
                  className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px]"
                >
                  {video.duration}
                </Badge>
              </div>
              <CardContent className="pt-3 pb-4">
                <Badge variant="outline" className="text-[10px] mb-1.5">
                  {video.category}
                </Badge>
                <p className="text-sm font-medium line-clamp-1">
                  {video.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {video.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedVideo && (
            <>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <div className="p-4">
                <Badge variant="outline" className="text-xs mb-2">
                  {selectedVideo.category}
                </Badge>
                <h3 className="font-semibold">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVideo.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
