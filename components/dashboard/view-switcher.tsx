"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, BarChart2 } from "lucide-react"

export function ViewSwitcher() {
  const { view, setView } = useAppStore()

  return (
    <div className="flex items-center bg-muted/50 rounded-full p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 rounded-full ${
          view === "grid" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "hover:bg-primary/10"
        } transition-all duration-300`}
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-xs">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 rounded-full ${
          view === "list" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "hover:bg-primary/10"
        } transition-all duration-300`}
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4 mr-1" />
        <span className="text-xs">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 rounded-full ${
          view === "graph" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "hover:bg-primary/10"
        } transition-all duration-300`}
        onClick={() => setView("graph")}
      >
        <BarChart2 className="h-4 w-4 mr-1" />
        <span className="text-xs">Charts</span>
      </Button>
    </div>
  )
}
