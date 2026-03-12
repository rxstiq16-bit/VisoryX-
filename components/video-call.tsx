"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Users,
  Maximize2,
  Minimize2,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Participant {
  id: string
  name: string
  avatar?: string
  isSpeaking: boolean
  isVideoOn: boolean
  isAudioOn: boolean
  isHost: boolean
}

interface VideoCallProps {
  orderId?: string
  participants?: Participant[]
  isOpen?: boolean
  onClose?: () => void
}

export function VideoCall({ orderId, participants: initialParticipants, isOpen = false, onClose }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants || [
      { id: "1", name: "You", isSpeaking: false, isVideoOn: true, isAudioOn: true, isHost: true },
      { id: "2", name: "Designer Alex", avatar: "/avatars/alex.jpg", isSpeaking: true, isVideoOn: true, isAudioOn: true, isHost: false },
    ]
  )

  // Timer
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Toggle handlers
  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleAudio = () => setIsAudioOn(!isAudioOn)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const endCall = () => {
    setCallDuration(0)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className={cn("max-w-4xl p-0", isFullscreen && "max-w-full h-screen")}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Design Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  {orderId && `Order #${orderId} • `}
                  {formatDuration(callDuration)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {participants.length}
              </Badge>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 bg-black p-4">
            <div className={cn(
              "grid h-full gap-4",
              participants.length === 1 && "grid-cols-1",
              participants.length === 2 && "grid-cols-2",
              participants.length > 2 && "grid-cols-2 lg:grid-cols-3"
            )}>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className={cn(
                    "relative flex items-center justify-center rounded-lg bg-muted",
                    participant.isSpeaking && "ring-2 ring-primary"
                  )}
                >
                  {participant.isVideoOn ? (
                    <video
                      ref={participant.id === "1" ? videoRef : undefined}
                      className="h-full w-full rounded-lg object-cover"
                      autoPlay
                      muted={participant.id === "1"}
                      playsInline
                    />
                  ) : (
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-2xl">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {/* Participant info */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {participant.name}
                      {participant.isHost && " (Host)"}
                    </Badge>
                    {!participant.isAudioOn && (
                      <Badge variant="destructive" className="px-1.5">
                        <MicOff className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 border-t bg-muted/50 p-4">
            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleAudio}
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-5 w-5" />
            </Button>
            
            <Button
              variant={isChatOpen ? "default" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <div className="mx-4 h-8 w-px bg-border" />
            
            <Button
              variant="destructive"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={endCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Call button component
interface StartCallButtonProps {
  orderId: string
  designerName: string
  className?: string
}

export function StartCallButton({ orderId, designerName, className }: StartCallButtonProps) {
  const [isCallOpen, setIsCallOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsCallOpen(true)} className={className}>
        <Video className="mr-2 h-4 w-4" />
        Video Call
      </Button>
      <VideoCall
        orderId={orderId}
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        participants={[
          { id: "1", name: "You", isSpeaking: false, isVideoOn: true, isAudioOn: true, isHost: false },
          { id: "2", name: designerName, isSpeaking: false, isVideoOn: true, isAudioOn: true, isHost: true },
        ]}
      />
    </>
  )
}
