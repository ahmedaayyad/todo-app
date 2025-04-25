"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { DateRangeDialog } from "@/components/tasks/date-range-dialog"
import { CategoriesDialog } from "@/components/tasks/categories-dialog"
import { ImportTasksDialog } from "@/components/tasks/import-tasks-dialog"
import { ExportTasksDialog } from "@/components/tasks/export-tasks-dialog"
import { UsersDialog } from "@/components/users/users-dialog"
import { ViewSwitcher } from "./view-switcher"
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog"
import { Plus, FileUp, FileDown, Users, Tag, Calendar, Undo2, Redo2, Keyboard } from "lucide-react"

export function TaskControls() {
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const { undo, redo, history } = useAppStore()

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1 shadow-xl transition-all duration-300 hover:shadow-2xl mb-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50"></div>
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-20 blur-sm group-hover:opacity-100 transition duration-300"></div>

      <div className="relative rounded-lg bg-card/80 backdrop-blur-sm p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Task Controls</h2>
            <ViewSwitcher />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Button
              onClick={() => setAddTaskOpen(true)}
              className="justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> New Task
            </Button>

            <Button
              variant="outline"
              className="justify-start hover:border-primary/50 transition-all duration-300 relative"
              onClick={() => setCategoriesOpen(true)}
            >
              <Tag className="h-4 w-4 mr-2" /> Categories
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {useAppStore((state) => state.categories.length)}
              </span>
            </Button>

            <Button
              variant="outline"
              className="justify-start hover:border-primary/50 transition-all duration-300"
              onClick={() => setDateRangeOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" /> Date Range
            </Button>

            <Button
              variant="outline"
              className="justify-start hover:border-primary/50 transition-all duration-300"
              onClick={() => setUsersOpen(true)}
            >
              <Users className="h-4 w-4 mr-2" /> Team
            </Button>

            <Button
              variant="outline"
              className="justify-start hover:border-primary/50 transition-all duration-300"
              onClick={() => setImportOpen(true)}
            >
              <FileUp className="h-4 w-4 mr-2" /> Import
            </Button>

            <Button
              variant="outline"
              className="justify-start hover:border-primary/50 transition-all duration-300"
              onClick={() => setExportOpen(true)}
            >
              <FileDown className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={history.position < 0}
                className="h-8 px-2 hover:bg-primary/10 transition-colors"
              >
                <Undo2 className="h-4 w-4 mr-1" /> Undo
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={history.position >= history.actions.length - 1}
                className="h-8 px-2 hover:bg-primary/10 transition-colors"
              >
                <Redo2 className="h-4 w-4 mr-1" /> Redo
              </Button>

              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-primary/10 transition-colors">
                <span className="text-xs text-muted-foreground">Shift+Click to select multiple tasks</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShortcutsOpen(true)}
              className="h-8 px-2 hover:bg-primary/10 transition-colors"
            >
              <Keyboard className="h-4 w-4 mr-1" /> Shortcuts
            </Button>
          </div>
        </div>
      </div>

      <AddTaskDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />
      <DateRangeDialog open={dateRangeOpen} onOpenChange={setDateRangeOpen} />
      <CategoriesDialog open={categoriesOpen} onOpenChange={setCategoriesOpen} />
      <ImportTasksDialog open={importOpen} onOpenChange={setImportOpen} />
      <ExportTasksDialog open={exportOpen} onOpenChange={setExportOpen} />
      <UsersDialog open={usersOpen} onOpenChange={setUsersOpen} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}
