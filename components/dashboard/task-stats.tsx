"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, BarChart } from "lucide-react"

export function TaskStats() {
  const { tasks } = useAppStore()

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Calculate overdue tasks
  const now = new Date()
  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false
    const dueDate = new Date(task.dueDate)
    return dueDate < now
  }).length

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Tasks</p>
              <h3 className="text-2xl font-bold">{totalTasks}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{completionPercentage}% completed</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
              <h3 className="text-2xl font-bold">{completedTasks}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {completedTasks > 0
              ? `You've completed ${completedTasks} ${completedTasks === 1 ? "task" : "tasks"}`
              : "No tasks completed yet"}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              <h3 className="text-2xl font-bold">{pendingTasks}</h3>
            </div>
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {pendingTasks > 0
              ? `You have ${pendingTasks} pending ${pendingTasks === 1 ? "task" : "tasks"}`
              : "No pending tasks"}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Overdue</p>
              <h3 className="text-2xl font-bold">{overdueTasks}</h3>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {overdueTasks > 0
              ? `${overdueTasks} ${overdueTasks === 1 ? "task is" : "tasks are"} overdue`
              : "No overdue tasks"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
