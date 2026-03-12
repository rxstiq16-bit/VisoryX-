"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Pause, Trash2, Upload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceNote {
  id: string
  blob: Blob
  duration: number
  createdAt: Date
}

interface VoiceNotesProps {
  onSave: (blob: Blob, duration: number) => void
  maxDuration?: number // in seconds
  className?: string
}

export function VoiceNotes({ onSave, maxDuration = 120, className }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access to record.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }

  const playRecording = () => {
    if (!audioBlob) return

    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(audioBlob))
      audioRef.current.onended = () => {
        setIsPlaying(false)
        setPlaybackProgress(0)
      }
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setPlaybackProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
      }
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setAudioBlob(null)
    setRecordingTime(0)
    setPlaybackProgress(0)
    setIsPlaying(false)
  }

  const saveRecording = () => {
    if (audioBlob) {
      onSave(audioBlob, recordingTime)
      deleteRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Voice Note</h4>
              <p className="text-xs text-muted-foreground">
                Record a voice memo to explain your project (max {Math.floor(maxDuration / 60)} min)
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {!audioBlob ? (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Recording indicator */}
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full transition-all",
                  isRecording
                    ? "animate-pulse bg-red-500/20"
                    : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                    isRecording ? "bg-red-500" : "bg-primary"
                  )}
                >
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Timer */}
              <div className="text-2xl font-mono tabular-nums">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </div>

              {/* Progress bar */}
              <Progress value={(recordingTime / maxDuration) * 100} className="w-full max-w-xs" />

              {/* Controls */}
              <div className="flex gap-2">
                {isRecording ? (
                  <Button variant="destructive" size="lg" onClick={stopRecording}>
                    <Square className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button size="lg" onClick={startRecording}>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Playback UI */}
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-full"
                  onClick={playRecording}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <div className="flex-1 space-y-1">
                  <Progress value={playbackProgress} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(Math.floor((playbackProgress / 100) * recordingTime))}</span>
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={deleteRecording}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button size="sm" onClick={saveRecording}>
                  <Upload className="mr-2 h-4 w-4" />
                  Attach to Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
