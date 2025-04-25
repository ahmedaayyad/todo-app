import { useAppStore } from "@/lib/store"
import { SortableTaskList } from "./sortable-task-list"

export function TaskList() {
  const tasks = useAppStore((state) => state.tasks)

  return <SortableTaskList tasks={tasks} />
}
