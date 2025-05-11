"use client"

import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import { motion } from "framer-motion"

export default function RewardsPage() {
  const totalAmount = 25

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title="REWARDS" icon="/images/pixel-coin.png" />

      <div className="space-y-8">
        {/* Main Treasure Vault */}
        <PixelatedContainer className="bg-gradient-to-b from-yellow-100 to-yellow-200">
          <h2 className="mb-4 font-arcade text-2xl text-yellow-800">TREASURE VAULT</h2>

          <div className="flex flex-col items-center">
            <div className="relative mb-6 h-48 w-48">
              <img src="/images/pixel-chest-large.png" alt="Treasure chest" className="h-full w-full object-contain" />

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
                <img src="/images/pixel-coin.png" alt="Coin" />
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
                <img src="/images/pixel-coin.png" alt="Coin" />
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
                <img src="/images/pixel-coin.png" alt="Coin" />
              </motion.div>
            </div>

            <div className="mb-4 rounded-full bg-white px-6 py-3 shadow-inner">
              <span className="font-arcade text-3xl text-yellow-700">${totalAmount} SAVED!</span>
            </div>

            <p className="mb-6 max-w-md text-center text-yellow-700">
              Your treasure is growing! All your rewards are safely stored until you turn 18. Keep completing quests to
              earn more coins!
            </p>

            {/* Timeline */}
            <div className="mt-4 w-full max-w-lg">
              <div className="relative h-12">
                <div className="absolute inset-0 h-4 translate-y-4 rounded-full bg-yellow-300"></div>

                {/* Current position */}
                <motion.div
                  className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center"
                  style={{ left: "20%" }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-white p-1 shadow-md">
                    <img src="/images/pixel-character.png" alt="You are here" />
                  </div>
                </motion.div>

                {/* End goal */}
                <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-yellow-500 p-1 shadow-md">
                    <img src="/images/pixel-flag.png" alt="Goal" />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="font-arcade text-sm text-yellow-700">NOW</span>
                <span className="font-arcade text-sm text-yellow-700">AGE 18</span>
              </div>
            </div>
          </div>
        </PixelatedContainer>

        {/* Recent Rewards */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <h2 className="mb-4 font-arcade text-xl text-purple-800">RECENT REWARDS</h2>

          <div className="space-y-3">
            <RewardHistoryItem icon="/images/pixel-broom.png" title="Clean Room!" amount={5} date="Today" />
            <RewardHistoryItem icon="/images/pixel-book.png" title="Read Book" amount={3} date="Yesterday" />
            <RewardHistoryItem icon="/images/pixel-dish.png" title="Help with Dishes" amount={4} date="3 days ago" />
            <RewardHistoryItem icon="/images/pixel-toothbrush.png" title="Brush Teeth" amount={2} date="4 days ago" />
          </div>
        </PixelatedContainer>
      </div>
    </div>
  )
}

interface RewardHistoryItemProps {
  icon: string
  title: string
  amount: number
  date: string
}

function RewardHistoryItem({ icon, title, amount, date }: RewardHistoryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-yellow-100 p-2">
          <img src={icon || "/placeholder.svg"} alt={title} className="h-full w-full object-contain" />
        </div>
        <div>
          <h4 className="font-arcade text-sm text-yellow-800">{title}</h4>
          <p className="text-xs text-yellow-600">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1">
        <img src="/images/pixel-coin-small.png" alt="Coins" className="h-4 w-4" />
        <span className="font-arcade text-sm text-yellow-800">+{amount}</span>
      </div>
    </div>
  )
}
