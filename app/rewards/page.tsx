"use client"

import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import AgeProgressBar from "@/components/age-progress-bar"
import { motion } from "framer-motion"

export default function RewardsPage() {
  const totalAmount = 25
  const currentAge = 8
  const targetAge = 18
  const progress = ((currentAge - 5) / (targetAge - 5)) * 100 // Assuming starting age is 5

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title="REWARDS" icon="/images/coin.png" />

      <div className="space-y-8">
        {/* Main Treasure Vault */}
        <PixelatedContainer className="bg-gradient-to-b from-yellow-100 to-yellow-200">
          <h2 className="mb-4 font-arcade text-2xl text-yellow-800">TREASURE VAULT</h2>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 h-48 w-48">
              <img src="/images/chest.png" alt="Treasure chest" className="h-full w-full object-contain scale-150" />

              {/* Animated coins */}
              <motion.div
                className="absolute -right-4 -top-4 h-12 w-12"
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
                <img src="/images/coin.png" alt="Coin" />
              </motion.div>

              <motion.div
                className="absolute -left-4 top-4 h-10 w-10"
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
                <img src="/images/coin.png" alt="Coin" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 right-0 h-8 w-8"
                animate={{
                  y: [0, -12, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 2.3,
                  delay: 0.7,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <img src="/images/coin.png" alt="Coin" />
              </motion.div>
            </div>

            <div className="mb-4 rounded-full bg-white px-6 py-3 shadow-inner">
              <span className="font-arcade text-3xl text-yellow-700">${totalAmount} SAVED!</span>
            </div>

            <p className="mb-6 max-w-md text-center text-yellow-700">
              Your treasure is growing! All your rewards are safely stored until you turn 18. Keep completing quests to
              earn more coins!
            </p>

            {/* Age Progress Bar */}
            <AgeProgressBar currentAge={currentAge} targetAge={targetAge} progress={progress} />
          </div>
        </PixelatedContainer>

        {/* Recent Rewards */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <h2 className="mb-4 font-arcade text-xl text-purple-800">RECENT REWARDS</h2>

          <div className="space-y-3">
            <RewardHistoryItem title="Clean Room!" amount={5} date="Today" />
            <RewardHistoryItem title="Read Book" amount={3} date="Yesterday" />
            <RewardHistoryItem title="Help with Dishes" amount={4} date="3 days ago" />
            <RewardHistoryItem title="Brush Teeth" amount={2} date="4 days ago" />
          </div>
        </PixelatedContainer>
      </div>
    </div>
  )
}

interface RewardHistoryItemProps {
  title: string
  amount: number
  date: string
}

function RewardHistoryItem({  title, amount, date }: RewardHistoryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        
        <div>
          <h4 className="font-arcade text-sm text-yellow-800">{title}</h4>
          <p className="text-xs text-yellow-600">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1">
        <img src="/images/coin.png" alt="Coins" className="h-4 w-4" />
        <span className="font-arcade text-sm text-yellow-800">+{amount}</span>
      </div>
    </div>
  )
}
