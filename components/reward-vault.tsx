"use client"

import { motion } from "framer-motion"
import PixelatedContainer from "./pixelated-container"

interface RewardVaultProps {
  amount: number
}

export default function RewardVault({ amount }: RewardVaultProps) {
  return (
    <PixelatedContainer className="bg-gradient-to-b from-yellow-100 to-yellow-200">
      <h2 className="mb-2 font-arcade text-xl text-yellow-800">TREASURE VAULT</h2>

      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-32 w-32">
          <img src="/images/chest.jpg" alt="Treasure chest" className="h-full w-full object-contain" />

          {/* Animated coins */}
          <motion.div
            className="absolute -right-2 -top-2 h-8 w-8"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <img src="/images/coin.jpg" alt="Coin" />
          </motion.div>

          <motion.div
            className="absolute -left-2 top-2 h-6 w-6"
            animate={{
              y: [0, -8, 0],
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{
              duration: 1.7,
              delay: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <img src="/images/coin.jpg" alt="Coin" />
          </motion.div>
        </div>

        <div className="mb-2 rounded-full bg-white px-4 py-2 shadow-inner">
          <span className="font-arcade text-2xl text-yellow-700">${amount} SAVED!</span>
        </div>

        <p className="text-center text-sm text-yellow-700">
          Your treasure is growing! It will be unlocked when you turn 18.
        </p>

        {/* Timeline */}
        <div className="mt-4 w-full">
          <div className="relative h-8">
            <div className="absolute inset-0 h-2 translate-y-3 rounded-full bg-yellow-300"></div>

            {/* Current position */}
            <motion.div
              className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center"
              style={{ left: "20%" }}
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <div className="h-6 w-6 rounded-full bg-white p-1 shadow-md">
                <img src="/images/pixel-character.png" alt="You are here" />
              </div>
            </motion.div>

            {/* End goal */}
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-yellow-500 p-1 shadow-md">
                <img src="/images/pixel-flag.png" alt="Goal" />
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="font-arcade text-xs text-yellow-700">NOW</span>
            <span className="font-arcade text-xs text-yellow-700">AGE 18</span>
          </div>
        </div>
      </div>
    </PixelatedContainer>
  )
}
