"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrushIcon as Broom, BookOpen, Bone, Edit, Check, X, Sparkles } from "lucide-react"
import { useState } from "react"
import EditTaskModal from "@/components/edit-task-modal"

interface TaskCardProps {
  id: string
  title: string
  description: string
  status: "pending" | "completed" | "submitted" | "rejected"
  child: string
  reward: number
  icon: "Broom" | "BookOpen" | "Bone"
  onUpdate: (task: any) => void
  onDelete: (id: string) => void
  onReview?: (taskId: number, status: 'completed' | 'rejected') => void
  tid?: number
}

export default function TaskCardV2({
  id,
  title,
  description,
  status,
  child,
  reward,
  icon,
  onUpdate,
  onDelete,
  onReview,
  tid
}: TaskCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showApproved, setShowApproved] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleApprove = () => {
    if (tid && onReview) {
      onReview(tid, 'completed')
    }
  }

  const handleReject = () => {
    if (tid && onReview) {
      onReview(tid, 'rejected')
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "Broom":
        return <Broom className="w-5 h-5 text-[#4B5563]" />
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-[#4B5563]" />
      case "Bone":
        return <Bone className="w-5 h-5 text-[#4B5563]" />
      default:
        return <Broom className="w-5 h-5 text-[#4B5563]" />
    }
  }

  const getStatusColor = () => {
    switch (currentStatus) {
      case "completed":
        return "bg-[#C4E4D2] text-[#4B5563]"
      case "submitted":
        return "bg-[#C9E4FF] text-[#4B5563]"
      case "rejected":
        return "bg-[#F8C6D2] text-[#4B5563]"
      default:
        return "bg-[#FFF4C9] text-[#4B5563]"
    }
  }

  const getStatusText = () => {
    switch (currentStatus) {
      case "completed":
        return "Completed"
      case "submitted":
        return "Submitted"
      case "rejected":
        return "Rejected"
      default:
        return "Pending"
    }
  }

  return (
    <Card
      className={`border-[#E5E7EB] ${
        showApproved ? "bg-[#C4E4D2]/20" : "bg-white"
      } transition-colors duration-300 shadow-sm hover:shadow ${isHovered ? "border-[#C9E4FF]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start md:items-center gap-4">
          <div
            className={`rounded-md flex items-center justify-center aspect-square w-10 md:w-12 flex-shrink-0 ${
              currentStatus === "completed" ? "bg-[#C4E4D2]/30" : "bg-[#F5F5F5]"
            }`}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[#4B5563] truncate">{title}</h3>
                  <Badge className={`${getStatusColor()} hover:bg-opacity-80`}>
                    {getStatusText()}
                  </Badge>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">{description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-[#6B7280]">Assigned to: {child}</span>
                  <span className="mx-2 text-[#E5E7EB]">•</span>
                  <span className="text-xs text-[#6B7280]">Reward: {reward} BTC</span>
                </div>
              </div>
              <div className="flex gap-2">
                {currentStatus === "submitted" && onReview && (
                  <>
                    <Button
                      onClick={handleApprove}
                      className="bg-[#C4E4D2] hover:bg-[#B0D5C0] text-[#4B5563] h-9 shadow-sm transition-all duration-200 hover:shadow"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={handleReject}
                      className="bg-[#F8C6D2] hover:bg-[#F8C6D2]/80 text-[#4B5563] h-9 shadow-sm transition-all duration-200 hover:shadow"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {currentStatus === "pending" && (
                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="bg-[#C9E4FF] hover:bg-[#C9E4FF]/80 text-[#4B5563] h-9 shadow-sm transition-all duration-200 hover:shadow"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {showApproved && (
          <div className="mt-3 text-sm text-[#4B5563] bg-[#C4E4D2]/30 p-3 rounded-lg flex items-center animate-pulse">
            <Sparkles className="w-4 h-4 mr-2 text-[#4B5563]" />
            <span>
              Task approved! {reward} BTC added to {child}'s savings.
            </span>
          </div>
        )}
        {showEditModal && (
          <EditTaskModal
            task={{ id, title, description, reward, child }}
            onClose={() => setShowEditModal(false)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  )
}
