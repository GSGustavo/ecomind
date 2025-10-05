"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import notificationsData from "@/data/notifications.json"

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
}

interface NotificationCategory {
  id: string
  name: string
  color: string
  notifications: Notification[]
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NotificationCategory[]>(notificationsData.categories)

  const unreadCount = notifications.reduce(
    (count, category) => count + category.notifications.filter((n) => !n.read).length,
    0,
  )

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((category) => ({
        ...category,
        notifications: category.notifications.map((n) => ({ ...n, read: true })),
      })),
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-bold text-[#0B3D91] dark:text-[#3498DB]">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto px-2 py-1 text-xs hover:bg-accent"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notifications.map((category) => (
              <div key={category.id} className="mb-4">
                <div className="mb-2 px-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">{category.name}</span>
                </div>
                <div className="space-y-1">
                  {category.notifications.map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 ${notification.read ? "bg-gray-50" : "bg-white"}`}>
                      <h4 className="text-sm font-bold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
