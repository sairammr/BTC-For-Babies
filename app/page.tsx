import Link from "next/link"
import { Button } from "@/components/ui/button"
import TaskCard from "@/components/task-card"
import RewardVault from "@/components/reward-vault"
import VirtualPet from "@/components/virtual-pet"
import { AchievementBadge } from "@/components/achievement-badge"
import PageTitle from "@/components/page-title"
import PixelatedContainer from "@/components/pixelated-container"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 overflow-hidden rounded-lg border-2 border-purple-400 bg-white p-1 shadow-md">
            <img src="/images/pixel-avatar.png" alt="Player avatar" className="h-full w-full object-contain" />
          </div>
          <div>
            <h2 className="font-arcade text-lg text-purple-800">PLAYER ONE</h2>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4">
                <img src="/images/pixel-star.png" alt="Level" />
              </div>
              <p className="font-arcade text-xs text-purple-600">LEVEL 5</p>
            </div>
          </div>
        </div>
        <Button className="bg-pink-400 font-arcade text-white hover:bg-pink-500">SETTINGS</Button>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        <PageTitle title="DASHBOARD" icon="/images/pixel-dashboard.png" />

        {/* Tasks Preview Section */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-arcade text-xl text-purple-800">LATEST QUESTS</h2>
            <Link href="/quests">
              <Button
                variant="outline"
                className="border-2 border-purple-300 bg-purple-100 font-arcade text-purple-700"
              >
                VIEW ALL
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TaskCard
              id="1"
              icon="/images/pixel-broom.png"
              title="Clean Room!"
              points={5}
              message="Make your bed and pick up toys"
              progress={75}
            />
            <TaskCard
              id="2"
              icon="/images/pixel-book.png"
              title="Read Book"
              points={3}
              message="Read for 20 minutes"
              progress={50}
            />
          </div>
        </PixelatedContainer>

        {/* Rewards and Pet Preview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/rewards" className="block transition-transform hover:scale-[1.02]">
            <RewardVault amount={25} />
          </Link>

          <Link href="/pet" className="block transition-transform hover:scale-[1.02]">
            <PixelatedContainer className="bg-gradient-to-b from-mint-100 to-mint-200">
              <h2 className="mb-2 font-arcade text-xl text-mint-800">YOUR PET</h2>
              <VirtualPet level={3} happiness={80} preview={true} />
            </PixelatedContainer>
          </Link>
        </div>

        {/* Achievements Section */}
        <PixelatedContainer className="bg-white/80 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-arcade text-xl text-purple-800">ACHIEVEMENTS</h2>
            <Button variant="outline" className="border-2 border-purple-300 bg-purple-100 font-arcade text-purple-700">
              VIEW ALL
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <AchievementBadge
              icon="/images/pixel-trophy.png"
              title="SUPER CLEANER"
              description="Cleaned room 5 times"
              unlocked
            />
            <AchievementBadge
              icon="/images/pixel-book-stack.png"
              title="BOOKWORM"
              description="Read 10 books"
              unlocked
            />
            <AchievementBadge icon="/images/pixel-streak.png" title="ON FIRE" description="5 day streak" unlocked />
          </div>
        </PixelatedContainer>
      </main>
    </div>
  )
}
