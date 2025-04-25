"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/hooks/use-auth"
import { ModeToggle } from "@/components/mode-toggle"
import { UserProfile } from "@/components/profile/user-profile"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Plus, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const { user, logout } = useAuth()
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useAppStore()

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Get initials for avatar fallback
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="dashboard-header bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative max-w-md w-full hidden md:flex">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, projects, or team members..."
            className="pl-10 bg-muted/40 border-none focus-visible:ring-1 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => markAllNotificationsAsRead()}>
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={`notification-${notification.id}`}
                    className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-muted/30" : ""}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`}
                      />
                      <div>
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />

        <Button onClick={() => setAddTaskOpen(true)} className="hidden md:flex">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddTaskDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
      <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  )
}
