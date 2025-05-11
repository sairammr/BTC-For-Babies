"use client"

import { motion } from "framer-motion"

interface AchievementBadgeProps {
  icon: string
  title: string
  description: string
  unlocked: boolean
}

export function AchievementBadge({ icon, title, description, unlocked }: AchievementBadgeProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border-2 ${
        unlocked ? "border-yellow-400 bg-yellow-50" : "border-gray-300 bg-gray-100"
      } p-3 shadow-sm transition-all hover:shadow-md`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {unlocked && (
        <motion.div
          className="absolute -right-1 -top-1 h-6 w-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img src="/images/pixel-star.png" alt="Unlocked" />
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-lg ${unlocked ? "bg-yellow-100" : "bg-gray-200"} p-2`}>
          <img
            src={icon || "/placeholder.svg"}
            alt={title}
            className={`h-full w-full object-contain ${!unlocked && "opacity-50 grayscale"}`}
          />
        </div>

        <div>
          <h4 className={`font-arcade text-sm ${unlocked ? "text-yellow-700" : "text-gray-500"}`}>{title}</h4>
          <p className={`text-xs ${unlocked ? "text-yellow-600" : "text-gray-400"}`}>{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
