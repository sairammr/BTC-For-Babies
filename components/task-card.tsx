"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTaskStore } from "@/lib/task-store"

interface TaskCardProps {
  id: string
  icon: string
  title: string
  points: number
  message: string
  progress: number
  completed?: boolean
}

export default function TaskCard({ id, icon, title, points, message, progress, completed = false }: TaskCardProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const { completeTask } = useTaskStore()

  const handleComplete = () => {
    if (!completed) {
      setShowConfetti(true)

      // Play sound effect
      const audio = new Audio("/sounds/complete.mp3")
      audio.volume = 0.5
      audio.play().catch((e) => console.log("Audio play failed:", e))

      setTimeout(() => {
        setShowConfetti(false)
        completeTask(id)
      }, 2000)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-purple-300 bg-white p-4 shadow-md transition-all hover:shadow-lg">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full"
              style={{
                backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FF8C42", "#A78BFA"][i % 5],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [0, Math.random() * 100 + 50],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 p-2">
            <img src={icon || "/placeholder.svg"} alt={title} className="h-full w-full object-contain" />
          </div>
          <h3 className="font-arcade text-lg text-purple-800">{title}</h3>
        </div>
        <div className="rounded-full bg-yellow-100 px-2 py-1">
          <span className="font-arcade text-sm text-yellow-700">+{points} COINS</span>
        </div>
      </div>

      <p className="mb-3 rounded-lg bg-purple-50 p-2 text-sm text-purple-600">{message}</p>

      <div className="mb-3">
        <div className="mb-1 flex justify-between">
          <span className="text-xs text-purple-600">Progress</span>
          <span className="font-arcade text-xs text-purple-800">{progress}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <Button
        className={`w-full font-arcade ${
          completed ? "bg-green-400 text-white hover:bg-green-500" : "bg-purple-500 text-white hover:bg-purple-600"
        }`}
        onClick={handleComplete}
        disabled={completed}
      >
        {completed ? "COMPLETED!" : "COMPLETE!"}
      </Button>
    </div>
  )
}
