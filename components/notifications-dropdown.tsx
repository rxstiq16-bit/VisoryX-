"use client"

import { useState, useEffect, useCallback } from 'react'
import { Bell, Check, CheckCheck, Package, MessageCircle, UserCheck, CreditCard, Edit, Star, Gift, Users, Tag, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  subscribeToNotifications,
  type Notification,
  type NotificationType
} from '@/lib/notifications'
import Link from 'next/link'

const NOTIFICATION_ICONS: Record<NotificationType, React.ElementType> = {
  order_status: Package,
  order_message: MessageCircle,
  order_assigned: UserCheck,
  order_delivered: Check,
  payment_received: CreditCard,
  revision_requested: Edit,
  review_request: Star,
  loyalty_points: Gift,
  referral_reward: Users,
  promo_code: Tag,
  system: Bell
}

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  order_status: 'text-blue-500 bg-blue-500/10',
  order_message: 'text-purple-500 bg-purple-500/10',
  order_assigned: 'text-green-500 bg-green-500/10',
  order_delivered: 'text-emerald-500 bg-emerald-500/10',
  payment_received: 'text-green-600 bg-green-600/10',
  revision_requested: 'text-orange-500 bg-orange-500/10',
  review_request: 'text-yellow-500 bg-yellow-500/10',
  loyalty_points: 'text-pink-500 bg-pink-500/10',
  referral_reward: 'text-indigo-500 bg-indigo-500/10',
  promo_code: 'text-red-500 bg-red-500/10',
  system: 'text-muted-foreground bg-muted'
}

function formatTimeAgo(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return then.toLocaleDateString()
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    const [notifs, count] = await Promise.all([
      getNotifications({ limit: 20 }),
      getUnreadCount()
    ])
    setNotifications(notifs)
    setUnreadCount(count)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        fetchNotifications()
      }
    })
  }, [fetchNotifications])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    const unsubscribe = subscribeToNotifications(userId, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return unsubscribe
  }, [userId])

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.read) return
    
    const success = await markAsRead(notification.id)
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead()
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const notification = notifications.find(n => n.id === notificationId)
    const success = await deleteNotification(notificationId)
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  if (!userId) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell
                const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.system
                
                const content = (
                  <div
                    className={cn(
                      "group flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => handleMarkAsRead(notification)}
                  >
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-tight",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                )

                if (notification.link) {
                  return (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  )
                }

                return <div key={notification.id}>{content}</div>
              })}
            </div>
          </ScrollArea>
        )}

        <div className="border-t px-4 py-2">
          <Link
            href="/dashboard/notifications"
            className="block text-center text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
