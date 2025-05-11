import type React from "react"
import { cn } from "@/lib/utils"

interface PixelatedContainerProps {
  children: React.ReactNode
  className?: string
}

export default function PixelatedContainer({ children, className }: PixelatedContainerProps) {
  return (
    <div className={cn("relative rounded-xl p-4 shadow-lg", className)}>
      {/* Pixelated corners */}
      <div className="absolute left-0 top-0 h-2 w-2 bg-white/30"></div>
      <div className="absolute right-0 top-0 h-2 w-2 bg-white/30"></div>
      <div className="absolute bottom-0 left-0 h-2 w-2 bg-white/30"></div>
      <div className="absolute bottom-0 right-0 h-2 w-2 bg-white/30"></div>

      {children}
    </div>
  )
}
