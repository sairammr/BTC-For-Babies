"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clipboard, Sparkles } from "lucide-react"

interface AddTaskModalProps {
  onClose: () => void
  onAddTask: (task: any) => void
  children: Array<{ id: string; name: string }>
}

export default function AddTaskModal({ onClose, onAddTask, children }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [reward, setReward] = useState("0.001")
  const [selectedChild, setSelectedChild] = useState("")
  const [icon, setIcon] = useState("Broom")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create new task object
    const newTask = {
      title: taskName,
      description,
      reward: Number.parseFloat(reward),
      child: children.find((child) => child.id === selectedChild)?.name || selectedChild,
      icon,
    }

    // Add the task
    onAddTask(newTask)

    // Close the modal
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-[#C9E4FF] shadow-lg">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[#4B5563] font-bold flex items-center">
            <Clipboard className="w-5 h-5 mr-2 text-[#C9E4FF]" />
            Create New Task
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
                className="border-[#C9E4FF] focus:ring-[#C9E4FF] shadow-sm"
                required
                placeholder="e.g., Clean bedroom"
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
                className="border-[#C9E4FF] focus:ring-[#C9E4FF] shadow-sm"
                rows={3}
                placeholder="e.g., Make bed, put away toys, vacuum floor"
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
                  className="border-[#C9E4FF] focus:ring-[#C9E4FF] shadow-sm"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="child" className="text-[#4B5563] flex items-center">
                  Assign To
                  <span className="text-[#F8C6D2] ml-1">*</span>
                </Label>
                <Select value={selectedChild} onValueChange={setSelectedChild} required>
                  <SelectTrigger className="border-[#C9E4FF] focus:ring-[#C9E4FF] shadow-sm">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon" className="text-[#4B5563]">
                Task Icon
              </Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger className="border-[#C9E4FF] focus:ring-[#C9E4FF] shadow-sm">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Broom">Cleaning</SelectItem>
                  <SelectItem value="BookOpen">Homework</SelectItem>
                  <SelectItem value="Bone">Pet Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#E5E7EB] text-[#4B5563] hover:bg-[#F5F5F5]"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#C4E4D2] hover:bg-[#C4E4D2]/80 text-[#4B5563] shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
