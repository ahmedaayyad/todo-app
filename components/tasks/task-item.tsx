"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import type { Task } from "@/types"
import { formatTime, formatDate, formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EditTaskDialog } from "./edit-task-dialog"
import { ShareTaskDialog } from "./share-task-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Calendar,
  Pencil,
  Share2,
  Timer,
  Trash2,
  Clock,
  Pause,
  Play,
  CheckCircle,
  AlertCircle,
  Clock8,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  GripVertical,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add role-based restrictions to task actions
import { useAuth } from "@/lib/hooks/use-auth"

interface TaskItemProps {
  task: Task
  multiSelectMode?: boolean
}

export function TaskItem({ task, multiSelectMode = false }: TaskItemProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [localTimeDisplay, setLocalTimeDisplay] = useState(formatTime(task.timer || 0))
  const [expanded, setExpanded] = useState(false)
  const { toast } = useToast()

  const {
    users,
    toggleTaskCompletion,
    deleteTask,
    toggleTaskSelection,
    selectedTasks,
    startTaskTimer,
    activeTimer,
    pauseTaskTimer,
    resumeTaskTimer,
  } = useAppStore()

  // Check if task has active timer
  const hasActiveTimer = activeTimer.taskId === task.id
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update timer display when active
  useEffect(() => {
    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Set initial display
    setLocalTimeDisplay(formatTime(task.timer || 0))

    // If this task has an active timer, start updating the display
    if (hasActiveTimer) {
      const updateTimer = () => {
        let elapsed = task.timer || 0

        if (activeTimer.startTime) {
          const now = new Date()
          elapsed += activeTimer.elapsed + (now.getTime() - activeTimer.startTime.getTime())
        } else {
          elapsed += activeTimer.elapsed
        }

        setLocalTimeDisplay(formatTime(elapsed))
      }

      // Update immediately
      updateTimer()

      // Then set interval
      timerIntervalRef.current = setInterval(updateTimer, 1000)
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [hasActiveTimer, activeTimer, task.timer])

  // Get assignee
  const assignee = users.find((u) => u.id === task.assignedTo)

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "priority-high"
      case "Medium":
        return "priority-medium"
      case "Low":
        return "priority-low"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700"
    }
  }

  // Check if task is selected
  const isSelected = selectedTasks.includes(task.id)

  // Calculate due date status
  const now = new Date()
  const dueDate = new Date(task.dueDate)
  const timeDiff = dueDate.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 3600 * 24)

  let dueDateStatus = {
    color: "green",
    text: `Due in ${Math.floor(daysDiff)} days`,
    icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
  }

  if (daysDiff < 0) {
    dueDateStatus = {
      color: "red",
      text: `Overdue by ${Math.abs(Math.floor(daysDiff))} days`,
      icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
    }
  } else if (daysDiff < 2) {
    dueDateStatus = {
      color: "yellow",
      text: daysDiff < 1 ? "Due today" : "Due tomorrow",
      icon: <Clock8 className="h-3.5 w-3.5 mr-1" />,
    }
  }

  // Handle task click to show due date notification
  const handleTaskClick = (e: React.MouseEvent) => {
    // Only show toast if not clicking on a button or switch
    if (!(e.target as HTMLElement).closest("button") && !(e.target as HTMLElement).closest('[role="checkbox"]')) {
      setExpanded(!expanded)
    }
  }

  // Handle checkbox click based on mode
  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (multiSelectMode) {
      e.preventDefault()
      toggleTaskSelection(task.id)
    } else {
      toggleTaskCompletion(task.id)
    }
  }

  // Inside the component
  const { hasPermission } = useAuth()

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
    <>
      <div
        className={`task-card group mb-4 hover:border-primary/30 transition-all duration-300 border ${isSelected ? "border-primary border-2" : "border-border/50"} rounded-lg bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md ${multiSelectMode ? "cursor-pointer" : ""}`}
        onClick={multiSelectMode ? () => toggleTaskSelection(task.id) : undefined}
      >
        <div className="task-card-header p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div
              className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={multiSelectMode ? isSelected : task.completed}
                onCheckedChange={
                  multiSelectMode ? () => toggleTaskSelection(task.id) : () => toggleTaskCompletion(task.id)
                }
                className={`${task.completed && !multiSelectMode ? "bg-primary border-primary" : ""} ${isSelected && multiSelectMode ? "bg-primary border-primary" : ""}`}
                onClick={handleCheckboxClick}
              />
            </div>
            <h3
              className={`text-base font-medium ${task.completed && !multiSelectMode ? "line-through text-muted-foreground" : ""}`}
              onClick={multiSelectMode ? undefined : handleTaskClick}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>

            {!multiSelectMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => toggleTaskCompletion(task.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {task.completed ? "Mark as incomplete" : "Mark as complete"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      if (activeTimer.taskId === task.id) {
                        if (activeTimer.startTime) {
                          pauseTaskTimer()
                        } else {
                          resumeTaskTimer()
                        }
                      } else {
                        startTaskTimer(task.id)
                      }
                    }}
                  >
                    {activeTimer.taskId === task.id ? (
                      activeTimer.startTime ? (
                        <>
                          <Pause className="h-4 w-4 mr-2 text-amber-500" />
                          Pause Timer
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2 text-emerald-500" />
                          Resume Timer
                        </>
                      )
                    ) : (
                      <>
                        <Timer className="h-4 w-4 mr-2" />
                        Start Timer
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Task
                  </DropdownMenuItem>

                  {hasPermission(users[0], "Staff") && (
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                  )}

                  {hasPermission(users[0], "Manager") && (
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Task
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="task-card-content p-4" onClick={multiSelectMode ? undefined : handleTaskClick}>
          {task.description && (
            <p className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-1"}`}>{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 text-xs bg-secondary/50 px-2 py-1 rounded-md">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{formatDate(task.dueDate)}</span>
            </div>

            {task.category && (
              <div className="flex items-center gap-1.5 text-xs bg-secondary/50 px-2 py-1 rounded-md">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span>{task.category}</span>
              </div>
            )}

            <Badge
              className={`flex items-center gap-1 text-xs
                ${
                  dueDateStatus.color === "red"
                    ? "priority-high"
                    : dueDateStatus.color === "yellow"
                      ? "priority-medium"
                      : "priority-low"
                }`}
            >
              {dueDateStatus.icon}
              {dueDateStatus.text}
            </Badge>
          </div>

          {expanded && (
            <>
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-4 pl-3 border-l-2 border-border/50">
                  <p className="text-xs font-medium mb-2">Subtasks:</p>
                  <div className="space-y-2">
                    {task.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50 mr-2"></div>
                        <span className="text-sm">{subtask}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.notes && (
                <div className="mt-4 pl-3 border-l-2 border-border/50">
                  <p className="text-xs font-medium mb-2">Notes:</p>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{task.notes}</div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="task-card-footer p-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6 ring-1 ring-primary/20">
                  <AvatarImage
                    src={assignee?.avatar || "/placeholder.svg?height=24&width=24"}
                    alt={assignee?.name || "User"}
                  />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(assignee?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{assignee?.name || "Unassigned"}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{localTimeDisplay}</span>
              </div>

              {task.lastEdited && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edited {formatDateTime(task.lastEdited)}</span>
                </div>
              )}
            </div>

            {!multiSelectMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 w-7 p-0 ${hasActiveTimer ? "text-accent" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}
                        onClick={() => {
                          if (activeTimer.taskId === task.id) {
                            if (activeTimer.startTime) {
                              pauseTaskTimer()
                            } else {
                              resumeTaskTimer()
                            }
                          } else {
                            startTaskTimer(task.id)
                          }
                        }}
                      >
                        {activeTimer.taskId === task.id ? (
                          activeTimer.startTime ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )
                        ) : (
                          <Timer className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {activeTimer.taskId === task.id
                        ? activeTimer.startTime
                          ? "Pause timer"
                          : "Resume timer"
                        : "Start timer"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTaskDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} task={task} />

      <ShareTaskDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} taskId={task.id} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the task "{task.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteTask(task.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
