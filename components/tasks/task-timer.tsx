"use client"

import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pause, Play, StopCircle, Timer, X } from "lucide-react"

export function TaskTimer() {
  const [timeDisplay, setTimeDisplay] = useState("00:00:00")
  const [minimized, setMinimized] = useState(false)
  const { tasks, activeTimer, pauseTaskTimer, resumeTaskTimer, stopTaskTimer } = useAppStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get the active task
  const activeTask = tasks.find((t) => t.id === activeTimer.taskId)

  // Update timer display
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!activeTask) return

    const updateTimer = () => {
      let elapsed = activeTask.timer || 0

      if (activeTimer.startTime) {
        const now = new Date()
        elapsed += activeTimer.elapsed + (now.getTime() - activeTimer.startTime.getTime())
      } else {
        elapsed += activeTimer.elapsed
      }

      setTimeDisplay(formatTime(elapsed))
    }

    // Update immediately
    updateTimer()

    // Then set interval if timer is running
    if (activeTimer.startTime) {
      intervalRef.current = setInterval(updateTimer, 1000)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeTask, activeTimer])

  if (!activeTask) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${minimized ? "w-16 h-16" : "w-80"}`}>
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

        <Card className="relative rounded-lg bg-card/80 backdrop-blur-sm border-0">
          <CardContent className={`p-4 ${minimized ? "hidden" : "block"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm truncate">{activeTask.title}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMinimized(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold font-mono">{timeDisplay}</div>
              <div className="flex items-center gap-2">
                {activeTimer.startTime ? (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-primary/20 hover:border-primary/50 transition-all duration-300"
                    onClick={pauseTaskTimer}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-primary/20 hover:border-primary/50 transition-all duration-300"
                    onClick={resumeTaskTimer}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={stopTaskTimer}>
                  <StopCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>

          {minimized && (
            <Button
              variant="ghost"
              className="h-16 w-16 p-0 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90"
              onClick={() => setMinimized(false)}
            >
              <Timer className="h-6 w-6" />
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
