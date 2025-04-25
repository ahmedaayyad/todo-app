"use client"

import { TaskItem } from "./task-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ClipboardList } from "lucide-react"
import type { Task } from "@/types"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SortableTaskItemProps {
  task: Task
}

function SortableTaskItem({ task }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="group">
      <div className="relative">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          {...listeners}
        >
          <div className="h-4 w-4 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>
        </div>
        <TaskItem task={task} />
      </div>
    </div>
  )
}

interface SortableTaskListProps {
  tasks: Task[]
}

export function SortableTaskList({ tasks }: SortableTaskListProps) {
  const { reorderTasks } = useAppStore()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id)
      const newIndex = tasks.findIndex((task) => task.id === over.id)

      reorderTasks(active.id as number, over.id as number)

      const sourceTask = tasks[oldIndex]
      const targetTask = tasks[newIndex]

      toast({
        title: "Tasks Reordered",
        description: `"${sourceTask.title}" and "${targetTask.title}" have been swapped`,
        duration: 3000,
      })
    }
  }

  if (tasks.length === 0) {
    return (
      <EmptyPlaceholder
        icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
        title="No tasks found"
        description="Try adjusting your filters or add a new task."
      />
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
