"use client"

import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import VirtualPet from "@/components/virtual-pet"
import { motion } from "framer-motion"

export default function PetPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title="PET" icon="/images/pixel-pet-icon.png" />

      <div className="space-y-8">
        {/* Main Pet Section */}
        <PixelatedContainer className="bg-gradient-to-b from-mint-100 to-mint-200">
          <h2 className="mb-4 font-arcade text-2xl text-mint-800">YOUR PET</h2>
          <VirtualPet level={3} happiness={80} preview={false} />
        </PixelatedContainer>

        {/* Pet Stats */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <h2 className="mb-4 font-arcade text-xl text-mint-800">PET STATS</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border-2 border-mint-200 bg-mint-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <img src="/images/pixel-level.png" alt="Level" className="h-6 w-6" />
                <h3 className="font-arcade text-mint-800">LEVEL</h3>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-arcade text-3xl text-mint-700">3</span>
                <div className="text-right">
                  <div className="text-xs text-mint-600">Next level in</div>
                  <div className="font-arcade text-sm text-mint-700">2 DAYS</div>
                </div>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full w-3/4 bg-mint-400"></div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-mint-200 bg-mint-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <img src="/images/pixel-heart.png" alt="Happiness" className="h-6 w-6" />
                <h3 className="font-arcade text-mint-800">HAPPINESS</h3>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-arcade text-3xl text-mint-700">80%</span>
                <div className="text-right">
                  <div className="text-xs text-mint-600">Status</div>
                  <div className="font-arcade text-sm text-mint-700">VERY HAPPY</div>
                </div>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full w-4/5 bg-mint-400"></div>
              </div>
            </div>
          </div>
        </PixelatedContainer>

        {/* Pet Accessories */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <h2 className="mb-4 font-arcade text-xl text-mint-800">ACCESSORIES</h2>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            <PetAccessory image="/images/pixel-hat.png" name="COOL HAT" unlocked={true} />
            <PetAccessory image="/images/pixel-glasses.png" name="SUNGLASSES" unlocked={true} />
            <PetAccessory image="/images/pixel-bowtie.png" name="BOW TIE" unlocked={true} />
            <PetAccessory image="/images/pixel-cape.png" name="CAPE" unlocked={false} requiredLevel={5} />
            <PetAccessory image="/images/pixel-wand.png" name="MAGIC WAND" unlocked={false} requiredLevel={7} />
          </div>
        </PixelatedContainer>
      </div>
    </div>
  )
}

interface PetAccessoryProps {
  image: string
  name: string
  unlocked: boolean
  requiredLevel?: number
}

function PetAccessory({ image, name, unlocked, requiredLevel }: PetAccessoryProps) {
  return (
    <motion.div
      className={`flex flex-col items-center rounded-lg border-2 p-3 text-center ${
        unlocked ? "border-mint-300 bg-mint-50" : "border-gray-200 bg-gray-50"
      }`}
      whileHover={unlocked ? { scale: 1.05 } : {}}
      whileTap={unlocked ? { scale: 0.95 } : {}}
    >
      <div className={`mb-2 h-16 w-16 rounded-lg p-2 ${unlocked ? "bg-mint-100" : "bg-gray-200"}`}>
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className={`h-full w-full object-contain ${!unlocked && "opacity-50 grayscale"}`}
        />
      </div>
      <h4 className={`font-arcade text-xs ${unlocked ? "text-mint-700" : "text-gray-500"}`}>{name}</h4>
      {!unlocked && requiredLevel && (
        <div className="mt-1 rounded-full bg-gray-200 px-2 py-1">
          <span className="text-xs text-gray-500">Level {requiredLevel}</span>
        </div>
      )}
    </motion.div>
  )
}
