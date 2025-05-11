"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clipboard, Trash2, Save } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EditTaskModalProps {
  task: {
    id: string
    title: string
    description: string
    reward: number
    child: string
  }
  onClose: () => void
  onUpdate: (task: any) => void
  onDelete: (id: string) => void
}

export default function EditTaskModal({ task, onClose, onUpdate, onDelete }: EditTaskModalProps) {
  const [taskName, setTaskName] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [reward, setReward] = useState(task.reward.toString())
  const [selectedChild, setSelectedChild] = useState(task.child.toLowerCase())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update the task
    onUpdate({
      id: task.id,
      title: taskName,
      description,
      reward: Number.parseFloat(reward),
      child: selectedChild,
    })

    // Close the modal
    onClose()
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-[#D9CFF3] shadow-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[#4B5563] font-bold flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-[#D9CFF3]" />
              Edit Task
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskName" className="text-[#4B5563] flex items-center">
                  Task Name
                  <span className="text-[#F8C6D2] ml-1">*</span>
                </Label>
                <Input
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="border-[#D9CFF3] focus:ring-[#D9CFF3] shadow-sm"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[#4B5563]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-[#D9CFF3] focus:ring-[#D9CFF3] shadow-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reward" className="text-[#4B5563] flex items-center">
                    Reward (BTC)
                    <span className="text-[#F8C6D2] ml-1">*</span>
                  </Label>
                  <Input
                    id="reward"
                    type="number"
                    min="0.0001"
                    step="0.0001"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="border-[#D9CFF3] focus:ring-[#D9CFF3] shadow-sm"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="child" className="text-[#4B5563] flex items-center">
                    Assign To
                    <span className="text-[#F8C6D2] ml-1">*</span>
                  </Label>
                  <Select value={selectedChild} onValueChange={setSelectedChild} required>
                    <SelectTrigger className="border-[#D9CFF3] focus:ring-[#D9CFF3] shadow-sm">
                      <SelectValue placeholder="Select child" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emma">Emma</SelectItem>
                      <SelectItem value="jack">Jack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button type="submit" className="bg-[#D9CFF3] hover:bg-[#D9CFF3]/80 text-[#4B5563] w-full shadow-sm">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-[#E5E7EB] text-[#4B5563] w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-white border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#4B5563]">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B7280]">
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#E5E7EB] text-[#4B5563]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
