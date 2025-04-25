"use client"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { TaskSelectionActions } from "@/components/tasks/task-selection-actions"
import { TaskTimer } from "@/components/tasks/task-timer"
import { ClipboardList, CheckSquare } from "lucide-react"
import { DraggableTaskList } from "@/components/tasks/draggable-task-list"
import { Button } from "@/components/ui/button"

export function TaskList() {
  const { tasks, filters, sort, view, selectedTasks, activeTimer, clearTaskSelection } = useAppStore()
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase()
      const titleMatch = task.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = task.description?.toLowerCase().includes(searchTerm) || false

      if (!titleMatch && !descriptionMatch) {
        return false
      }
    }

    // Category filter
    if (filters.category && filters.category !== "all" && task.category !== filters.category) {
      return false
    }

    // Priority filter
    if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority) {
      return false
    }

    // Status filter
    if (filters.status === "Completed" && !task.completed) return false
    if (filters.status === "Active" && task.completed) return false

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const taskDate = new Date(task.dueDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)

      // Set time to beginning and end of day for proper comparison
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      if (taskDate < startDate || taskDate > endDate) {
        return false
      }
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status (completed tasks go to the bottom)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then apply the user's selected sort
    let result = 0

    switch (sort.by) {
      case "dueDate":
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0
        result = dateA - dateB
        break
      case "priority": {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 }
        const priorityA = priorityOrder[a.priority] ?? 999
        const priorityB = priorityOrder[b.priority] ?? 999
        result = priorityA - priorityB
        break
      }
      case "title":
        result = (a.title || "").localeCompare(b.title || "")
        break
      case "created":
        const createdA = a.created ? new Date(a.created).getTime() : 0
        const createdB = b.created ? new Date(b.created).getTime() : 0
        result = createdA - createdB
        break
      default:
        result = 0
    }

    return sort.direction === "asc" ? result : -result
  })

  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    if (multiSelectMode) {
      // If turning off multi-select mode, clear selections
      clearTaskSelection()
    }
    setMultiSelectMode(!multiSelectMode)
  }

  if (view !== "list") return null

  return (
    <div className="mb-8">
      {selectedTasks.length > 0 && <TaskSelectionActions />}

      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

        <div className="relative rounded-lg bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ClipboardList className="h-5 w-5 text-primary" />
              Tasks
              <span className="text-sm font-normal text-muted-foreground ml-2">({sortedTasks.length})</span>
            </h2>
            <Button
              variant={multiSelectMode ? "default" : "outline"}
              size="sm"
              onClick={toggleMultiSelectMode}
              className={multiSelectMode ? "bg-primary text-primary-foreground" : ""}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {multiSelectMode ? "Exit Selection Mode" : "Select Multiple Tasks"}
            </Button>
          </div>
          <div className="p-4">
            <DraggableTaskList tasks={sortedTasks} multiSelectMode={multiSelectMode} />
          </div>
        </div>
      </div>

      {activeTimer.taskId && <TaskTimer />}
    </div>
  )
}
