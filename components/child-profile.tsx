import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle, Coins, Settings } from "lucide-react"

interface ChildProfileProps {
  name: string
  tasksCompleted: number
  totalRewards: number
}

export default function ChildProfile({ name, tasksCompleted, totalRewards }: ChildProfileProps) {
  return (
    <Card className="border-[#C9E4FF] shadow-sm hover:shadow transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C9E4FF] to-[#F8C6D2] rounded-full flex items-center justify-center mr-3 shadow-sm">
              <span className="text-[#4B5563] font-bold">{name.charAt(0)}</span>
            </div>
            <h3 className="font-bold text-[#4B5563]">{name}</h3>
          </div>
          <Button variant="ghost" size="icon" className="text-[#4B5563] hover:bg-[#F5F5F5]">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#F5F5F5] p-3 rounded-lg shadow-sm">
            <div className="flex items-center">

              <CheckCircle className="w-4 h-4 text-[#4B5563] mr-2" />
              <span className="text-xs text-[#6B7280]">Tasks</span>
            </div>
            <p className="text-lg font-bold text-[#4B5563] mt-1">{tasksCompleted}</p>
          </div>
          <div className="bg-[#F5F5F5] p-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Coins className="w-4 h-4 text-[#4B5563] mr-2" />
              <span className="text-xs text-[#6B7280]">Rewards</span>
            </div>
            <p className="text-lg font-bold text-[#4B5563] mt-1">{totalRewards} BTC</p>
          </div>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList className="grid grid-cols-2 h-9 bg-[#F5F5F5] p-1 rounded-lg">
            <TabsTrigger value="tasks" className="text-xs data-[state=active]:bg-[#F8C6D2] rounded">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs data-[state=active]:bg-[#C4E4D2] rounded">
              Rewards
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-3">
            <div className="text-sm text-[#4B5563]">
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Clean bedroom</span>
                <Badge status="pending" />
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Homework</span>
                <Badge status="completed" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="rewards" className="mt-3">
            <div className="text-sm text-[#4B5563]">
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Homework</span>
                <span className="text-[#6B7280]">0.002 BTC</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span>Clean bedroom</span>
                <span className="text-[#6B7280]">0.001 BTC</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Badge({ status }: { status: "pending" | "completed" }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        status === "pending" ? "bg-[#FFF4C9] text-[#4B5563]" : "bg-[#C4E4D2] text-[#4B5563]"
      }`}
    >
      {status === "pending" ? "Pending" : "Completed"}
    </span>
  )
}
