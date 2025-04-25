"use client"

import { useAppStore } from "@/lib/store"
import { TrendingUp, Clock, Calendar, AlertTriangle } from "lucide-react"
import { formatTime } from "@/lib/utils"

export function Insights() {
  const { tasks } = useAppStore()

  // Calculate productivity score
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate upcoming deadlines
  const now = new Date()
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(now.getDate() + 2)

  const upcomingDeadlines = tasks.filter((task) => {
    if (task.completed) return false

    const dueDate = new Date(task.dueDate)
    return dueDate >= now && dueDate <= twoDaysFromNow
  }).length

  // Calculate overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (task.completed) return false

    const dueDate = new Date(task.dueDate)
    return dueDate < now
  }).length

  // Calculate average completion time
  const completedTasksWithTimer = tasks.filter((t) => t.completed && t.timer > 0)
  const avgCompletionTime =
    completedTasksWithTimer.length > 0
      ? completedTasksWithTimer.reduce((sum, task) => sum + task.timer, 0) / completedTasksWithTimer.length
      : 0

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Your Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Productivity Score */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Productivity</h3>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{productivityScore}%</span>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>5%</span>
                </div>
              </div>

              <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
                  style={{ width: `${productivityScore}%` }}
                ></div>
              </div>

              <p className="text-sm text-muted-foreground">Task completion rate</p>
            </div>
          </div>
        </div>

        {/* Time Management */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avg. Time</h3>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold">{formatTime(Math.round(avgCompletionTime))}</div>
              <p className="text-sm text-muted-foreground">Per completed task</p>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-amber-500/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming</h3>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold">{upcomingDeadlines}</div>
              <p className="text-sm text-muted-foreground">Due in 48 hours</p>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/5 via-rose-500/10 to-rose-500/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-rose-500/5 opacity-50"></div>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

          <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Overdue</h3>
              <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold">{overdueTasks}</div>
              <p className="text-sm text-muted-foreground">Past due date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
