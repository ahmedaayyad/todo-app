"use client"

import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Settings,
  Users,
  Calendar,
  Clock,
  HelpCircle,
  LogOut,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  collapsed: boolean
  currentPath: string
}

export function Sidebar({ collapsed, currentPath }: SidebarProps) {
  const { user, logout } = useAuth()

  // Get initials for avatar fallback
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Tasks",
      href: "/dashboard/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Time Tracking",
      href: "/dashboard/time",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <aside
      className={`dashboard-sidebar ${collapsed ? "collapsed" : ""} bg-card border-r border-border/50 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-border/50">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg p-1.5">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Todo-App
            </h1>
          </div>
        ) : (
          <div className="mx-auto bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg p-1.5">
            <Sparkles className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const isActive = currentPath === item.href

              return collapsed ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className={`sidebar-item-collapsed ${isActive ? "active" : ""} mb-1`}>
                      {item.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.name} href={item.href} className={`sidebar-item ${isActive ? "active" : ""} mb-1`}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </TooltipProvider>
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={logout} className="mx-auto">
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
