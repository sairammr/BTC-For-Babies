"use client"

import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"
import VirtualPet from "@/components/virtual-pet"
import { motion } from "framer-motion"

export default function PetPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <PageTitle title="PET" icon="/images/pets.png" />

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
                <img src="/images/diamond.png" alt="Level" className="h-6 w-6" />
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
                <img src="/images/gem.png" alt="Happiness" className="h-6 w-6" />
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
       
      </div>
    </div>
  )
}



