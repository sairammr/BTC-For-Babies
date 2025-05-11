"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface NotificationBannerProps {
  id: string
  message: string
  type: "success" | "warning" | "info"
  onClose: () => void
}

export default function NotificationBanner({ id, message, type, onClose }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-[#C4E4D2]/30 border-[#C4E4D2]"
      case "warning":
        return "bg-[#FFF4C9]/30 border-[#FFF4C9]"
      case "info":
        return "bg-[#C9E4FF]/30 border-[#C9E4FF]"
      default:
        return "bg-[#D9CFF3]/30 border-[#D9CFF3]"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#4B5563]" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-[#4B5563]" />
      case "info":
        return <Info className="w-5 h-5 text-[#4B5563]" />
      default:
        return <CheckCircle className="w-5 h-5 text-[#4B5563]" />
    }
  }

  return (
    <div
      className={`${getBgColor()} border rounded-lg p-3 flex items-center justify-between shadow-sm ${
        isExiting ? "opacity-0 transform -translate-y-2" : "opacity-100"
      } transition-all duration-300`}
    >
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-2 text-sm font-medium text-[#4B5563]">{message}</span>
      </div>
      <button onClick={handleClose} className="text-[#4B5563] hover:bg-[#00000010] rounded-full p-1 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
