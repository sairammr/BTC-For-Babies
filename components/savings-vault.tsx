import { Card, CardContent } from "@/components/ui/card"
import { Coins, Info } from "lucide-react"

interface SavingsVaultProps {
  childName: string
  balance: number
}

export default function SavingsVault({ childName, balance }: SavingsVaultProps) {
  return (
    <Card className="border-[#FFF4C9] bg-[#FFF4C9]/20 shadow-sm hover:shadow transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#4B5563]">{childName}'s Savings</h3>
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFF4C9] to-[#F8C6D2] rounded-full flex items-center justify-center shadow-sm">
            <Coins className="w-5 h-5 text-[#4B5563]" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-[#4B5563]">{balance.toFixed(4)}</span>
            <span className="ml-2 text-xs text-[#6B7280]">BTC in Savings</span>
          </div>

          <div className="mt-2 flex items-center text-xs text-[#6B7280]">
            <Info className="w-3 h-3 mr-1" />
            <span>Releases at age 18</span>
          </div>

          <div className="mt-3 w-full bg-[#E5E7EB] rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-[#F8C6D2] to-[#C9E4FF] h-1.5 rounded-full"
              style={{ width: `${Math.min((balance / 0.05) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-[#6B7280]">
            <span>0 BTC</span>
            <span>Goal: 0.05 BTC</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-[#6B7280] flex items-center">
          <Info className="w-3 h-3 mr-1" />
          <span>Funds are securely stored in an on-chain escrow</span>
        </div>
      </CardContent>
    </Card>
  )
}
