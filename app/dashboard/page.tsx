import { DashboardLayout } from "@/components/dashboard/layout"
import { TaskStats } from "@/components/dashboard/task-stats"
import { TaskControls } from "@/components/dashboard/task-controls"
import { TaskFilters } from "@/components/dashboard/task-filters"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskCharts } from "@/components/dashboard/task-charts"
import { Insights } from "@/components/dashboard/insights"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <TaskStats />
          <TaskControls />
        </div>
        <TaskFilters />
        <TaskList />
        <TaskCharts />
        <Insights />
      </div>
    </DashboardLayout>
  )
}
