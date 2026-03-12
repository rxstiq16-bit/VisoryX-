"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Sound URLs - these would be actual sound files in production
const SOUNDS = {
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  notification: "/sounds/notification.mp3",
  message: "/sounds/message.mp3",
  click: "/sounds/click.mp3",
  pop: "/sounds/pop.mp3",
} as const

type SoundName = keyof typeof SOUNDS

interface UseSoundOptions {
  volume?: number
  playbackRate?: number
}

export function useSound(soundName: SoundName, options: UseSoundOptions = {}) {
  const { volume = 0.5, playbackRate = 1 } = options
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check localStorage for sound preferences
    const soundPreference = localStorage.getItem("soundEnabled")
    if (soundPreference !== null) {
      setIsEnabled(soundPreference === "true")
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(SOUNDS[soundName])
      audioRef.current.volume = volume
      audioRef.current.playbackRate = playbackRate
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [soundName, volume, playbackRate])

  const play = useCallback(() => {
    if (!isEnabled || !audioRef.current) return

    // Reset to start if already playing
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {
      // Ignore autoplay errors
    })
  }, [isEnabled])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const toggle = useCallback(() => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    localStorage.setItem("soundEnabled", String(newValue))
  }, [isEnabled])

  return { play, stop, isEnabled, toggle }
}

// Hook for managing all sound preferences
export function useSoundPreferences() {
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(0.5)

  useEffect(() => {
    const soundEnabled = localStorage.getItem("soundEnabled")
    const soundVolume = localStorage.getItem("soundVolume")

    if (soundEnabled !== null) setEnabled(soundEnabled === "true")
    if (soundVolume !== null) setVolume(parseFloat(soundVolume))
  }, [])

  const toggleEnabled = useCallback(() => {
    const newValue = !enabled
    setEnabled(newValue)
    localStorage.setItem("soundEnabled", String(newValue))
  }, [enabled])

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    localStorage.setItem("soundVolume", String(newVolume))
  }, [])

  return { enabled, volume, toggleEnabled, updateVolume }
}
