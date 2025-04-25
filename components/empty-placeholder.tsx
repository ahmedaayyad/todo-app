"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyPlaceholderProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  action?: () => void
}

export function EmptyPlaceholder({
  icon,
  title,
  description,
  actionLabel = "Add New",
  actionIcon = <Plus className="h-4 w-4 mr-2" />,
  action,
}: EmptyPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 rounded-full bg-muted p-3">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && (
        <Button
          onClick={action}
          className="mt-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
