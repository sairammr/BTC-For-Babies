"use client"

import { motion } from "framer-motion"

interface AgeProgressBarProps {
  currentAge: number
  targetAge: number
  progress: number // 0-100
}

export default function AgeProgressBar({ currentAge, targetAge, progress }: AgeProgressBarProps) {
  return (
    <div className="mt-4 w-full max-w-lg">
      <div className="relative h-12">
        {/* Background track */}
        <div className="absolute inset-0 h-4 translate-y-4 rounded-full bg-yellow-300"></div>

        {/* Progress track with glow effect */}
        <div 
          className="absolute inset-0 h-4 translate-y-4 rounded-full bg-gradient-to-r from-pink-700 to-purple-700"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-50 blur-sm"></div>
        </div>

        {/* Current position */}
        <motion.div
          className="absolute top-0 flex h-12 w-12 items-center justify-center"
          style={{ left: `${progress}%` }}
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="h-10 w-10 rounded-full bg-white p-1 shadow-md">
            <img src="/images/gem.png" alt="You are here" className="h-full w-full" />
          </div>
        </motion.div>

        {/* End goal */}
        <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-yellow-500 p-1 shadow-md">
            <img src="/images/pink-gem.png" alt="Goal" className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <span className="font-arcade text-sm text-yellow-700">AGE {currentAge}</span>
        <span className="font-arcade text-sm text-yellow-700">AGE {targetAge}</span>
      </div>
    </div>
  )
} 