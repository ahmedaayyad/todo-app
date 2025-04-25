"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangeDialog } from "@/components/tasks/date-range-dialog"
import { ArrowUpDown, ArrowDownUp, Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function TaskFilters() {
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filters = useAppStore((state) => state.filters)
  const setFilter = useAppStore((state) => state.setFilter)
  const clearFilters = useAppStore((state) => state.clearFilters)
  const sort = useAppStore((state) => state.sort)
  const setSort = useAppStore((state) => state.setSort)
  const categories = useAppStore((state) => state.categories)

  // Fix the sort direction toggle function to apply to all tasks
  const toggleSortDirection = () => {
    if (sort.by === "none") {
      // If no sort is selected, don't toggle direction
      return
    }
    const newDirection = sort.direction === "asc" ? "desc" : "asc"
    setSort(sort.by, newDirection)
  }

  // Update the handleDateFilterChange function to apply to all tasks
  const handleDateFilterChange = (value: string) => {
    if (value === "custom") {
      setDateRangeOpen(true)
    } else if (value === "all") {
      setFilter("dateRange", { start: null, end: null })
    } else if (value === "today") {
      const today = new Date().toISOString().split("T")[0]
      setFilter("dateRange", { start: today, end: today })
    } else if (value === "week") {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(today)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      setFilter("dateRange", {
        start: startOfWeek.toISOString().split("T")[0],
        end: endOfWeek.toISOString().split("T")[0],
      })
    } else if (value === "month") {
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      setFilter("dateRange", {
        start: startOfMonth.toISOString().split("T")[0],
        end: endOfMonth.toISOString().split("T")[0],
      })
    }
  }

  // Improve the sort function to ensure it applies to all tasks
  const handleSortChange = (value: string) => {
    // Apply the sort to all tasks
    setSort(value as "dueDate" | "priority" | "title" | "created" | "none")
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.category ||
    filters.priority ||
    filters.status ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.search

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

        <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                className="pl-10 pr-10 rounded-full border-primary/20 focus-visible:ring-primary/30"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-primary/10"
                  onClick={() => setFilter("search", "")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                className={`h-10 ${showFilters ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" : "hover:border-primary/50"} transition-all duration-300`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30 h-5 px-1">
                    {Object.values(filters).filter((f) => f && typeof f === "string" && f !== "all").length +
                      (filters.dateRange.start ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Select value={sort.by} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[130px] h-10 rounded-full border-primary/20 focus:ring-primary/30">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="created">Created Date</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortDirection}
                  className="h-10 w-10 rounded-full border-primary/20 hover:border-primary/50 transition-all duration-300"
                  disabled={sort.by === "none"}
                >
                  {sort.direction === "asc" ? <ArrowUpDown className="h-4 w-4" /> : <ArrowDownUp className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50 animate-fade-in">
              <Select value={filters.category || "all"} onValueChange={(value) => setFilter("category", value)}>
                <SelectTrigger className="rounded-lg border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priority || "all"} onValueChange={(value) => setFilter("priority", value)}>
                <SelectTrigger className="rounded-lg border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status || "all"} onValueChange={(value) => setFilter("status", value)}>
                <SelectTrigger className="rounded-lg border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={
                  filters.dateRange.start && filters.dateRange.end
                    ? filters.dateRange.start === filters.dateRange.end
                      ? "today"
                      : "custom"
                    : "all"
                }
                onValueChange={handleDateFilterChange}
              >
                <SelectTrigger className="rounded-lg border-primary/20 focus:ring-primary/30">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <div className="col-span-full flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-muted-foreground hover:bg-primary/10 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DateRangeDialog open={dateRangeOpen} onOpenChange={setDateRangeOpen} />
    </>
  )
}
