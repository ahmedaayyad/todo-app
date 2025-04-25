"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAppStore } from "@/lib/store"

interface CategoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriesDialog({ open, onOpenChange }: CategoriesDialogProps) {
  const { categories, setCategories, addCategory, removeCategory } = useAppStore()
  const [newCategory, setNewCategory] = useState("")
  const [localCategories, setLocalCategories] = useState<string[]>([])

  const { toast } = useToast()

  // Initialize local categories from store when dialog opens
  useEffect(() => {
    if (open) {
      setLocalCategories([...categories])
    }
  }, [open, categories])

  // Update the handleAddCategory function to immediately add the category to the store
  const handleAddCategory = () => {
    if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
      const category = newCategory.trim()
      setLocalCategories([...localCategories, category])
      // Add the category to the store immediately
      addCategory(category)
      setNewCategory("")
    }
  }

  // Update the handleRemoveCategory function to immediately remove the category from the store
  const handleRemoveCategory = (category: string) => {
    setLocalCategories(localCategories.filter((c) => c !== category))
    // Remove the category from the store immediately
    removeCategory(category)
  }

  // Update the handleSave function to show a success message but not overwrite categories
  const handleSave = () => {
    toast({
      title: "Categories Saved",
      description: "Your categories have been updated successfully.",
    })

    // Close dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-category">Add New Category</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="new-category"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Categories</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[100px]">
              {localCategories.length > 0 ? (
                localCategories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                  No categories added
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
