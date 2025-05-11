"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface VirtualPetProps {
  level: number
  happiness: number
  preview?: boolean
}

export default function VirtualPet({ level, happiness, preview = false }: VirtualPetProps) {
  const [petHappiness, setPetHappiness] = useState(happiness)
  const [isFeeding, setIsFeeding] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const feedPet = () => {
    if (petHappiness < 100) {
      setIsFeeding(true)
      setTimeout(() => {
        setPetHappiness((prev) => Math.min(prev + 10, 100))
        setIsFeeding(false)
      }, 1000)
    }
  }

  const playWithPet = () => {
    if (petHappiness < 100) {
      setIsPlaying(true)
      setTimeout(() => {
        setPetHappiness((prev) => Math.min(prev + 15, 100))
        setIsPlaying(false)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 rounded-full bg-white px-3 py-1 shadow-sm">
        <span className="font-arcade text-sm text-mint-700">LEVEL {level}</span>
      </div>

      <div className="relative mb-4 h-40 w-40">
        <div className="absolute bottom-0 left-1/2 h-12 w-24 -translate-x-1/2 rounded-[50%] bg-mint-300/50 blur-sm"></div>

        <motion.div
          className="relative h-full w-full"
          animate={
            isFeeding
              ? { scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }
              : isPlaying
                ? { y: [0, -20, 0], rotate: [0, 10, 0, -10, 0] }
                : { y: [0, -5, 0], rotate: [0, 2, 0, -2, 0] }
          }
          transition={{
            duration: isFeeding || isPlaying ? 1 : 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <img src="/images/pixel-pet.png" alt="Virtual pet" className="h-full w-full object-contain" />

          {isFeeding && (
            <motion.div
              className="absolute right-0 top-0 h-8 w-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <img src="/images/pixel-heart.png" alt="Love" />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="mb-3 w-full">
        <div className="mb-1 flex justify-between">
          <span className="text-xs text-mint-700">Happiness</span>
          <span className="font-arcade text-xs text-mint-800">{petHappiness}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-white/50">
          <motion.div
            className="h-full bg-gradient-to-r from-mint-300 to-mint-500"
            initial={{ width: 0 }}
            animate={{ width: `${petHappiness}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {!preview && (
        <div className="flex w-full gap-2">
          <Button
            className="flex-1 bg-mint-500 font-arcade text-white hover:bg-mint-600"
            onClick={feedPet}
            disabled={isFeeding || petHappiness >= 100}
          >
            FEED
          </Button>
          <Button
            className="flex-1 bg-mint-500 font-arcade text-white hover:bg-mint-600"
            onClick={playWithPet}
            disabled={isPlaying || petHappiness >= 100}
          >
            PLAY
          </Button>
        </div>
      )}
    </div>
  )
}
