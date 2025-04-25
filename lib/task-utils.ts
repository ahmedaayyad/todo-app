import type { Task } from "@/types"

export function swapTasks(tasks: Task[], sourceId: number, targetId: number): Task[] {
  // Find source and target tasks
  const sourceTask = tasks.find((t) => t.id === sourceId)
  const targetTask = tasks.find((t) => t.id === targetId)

  // If either task is not found, return original array
  if (!sourceTask || !targetTask) return tasks

  // Find source and target indices
  const sourceIndex = tasks.findIndex((t) => t.id === sourceId)
  const targetIndex = tasks.findIndex((t) => t.id === targetId)

  // Create a new array of tasks
  const newTasks = [...tasks]

  // Swap the tasks
  newTasks[sourceIndex] = targetTask
  newTasks[targetIndex] = sourceTask

  return newTasks
}
