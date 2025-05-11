"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, Check } from "lucide-react"

interface ConnectWalletModalProps {
  onClose: () => void
  onConnect: (address: string) => void
}

export default function ConnectWalletModal({ onClose, onConnect }: ConnectWalletModalProps) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnect = async (walletType: string) => {
    setConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "bc1q9h5yjvuhax8xruk7l8zuvkgvlzgwztwgf5j4xp"
      setWalletAddress(mockAddress)
      setConnecting(false)
      setConnected(true)

      // Call the onConnect callback
      onConnect(mockAddress)

      // Close after showing success
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-[#FFF4C9] shadow-lg">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[#4B5563] font-bold flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-[#FFF4C9]" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        {!connected ? (
          <div className="py-4 space-y-4">
            <p className="text-sm text-[#6B7280]">
              Connect your wallet to manage your children's Bitcoin rewards and escrow accounts.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => handleConnect("bitcoin")}
                disabled={connecting}
                className="w-full justify-between bg-white hover:bg-[#F5F5F5] text-[#4B5563] border border-[#E5E7EB] shadow-sm transition-all duration-200 hover:shadow"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <WalletIcon type="bitcoin" />
                  </div>
                  <span>Bitcoin Wallet</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => handleConnect("lightning")}
                disabled={connecting}
                className="w-full justify-between bg-white hover:bg-[#F5F5F5] text-[#4B5563] border border-[#E5E7EB] shadow-sm transition-all duration-200 hover:shadow"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <WalletIcon type="lightning" />
                  </div>
                  <span>Lightning Wallet</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {connecting && (
              <div className="text-center py-2">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#C9E4FF] border-r-transparent"></div>
                <p className="mt-2 text-sm text-[#6B7280]">Connecting to wallet...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#C4E4D2]/30 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-[#4B5563]" />
            </div>
            <div>
              <p className="text-[#4B5563] font-medium">Wallet Connected!</p>
              <p className="text-xs text-[#6B7280] mt-1 font-mono">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 6)}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function WalletIcon({ type }: { type: "bitcoin" | "lightning" }) {
  if (type === "bitcoin") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.977-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.17-1.064-.25l.53-2.12-1.32-.33-.54 2.153c-.285-.065-.565-.13-.84-.2l-1.815-.45-.35 1.4s.977.225.955.238c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.347.015.02-.96-.24-.96-.24l-.655 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.54 2.154 1.32.33.54-2.18c2.24.427 3.93.255 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.22 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.52 2.75 2.084v.006z"
          fill="#F7931A"
        />
      </svg>
    )
  } else {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.8 0L9.2 4.8H14.4L2.4 24L8.4 12H4.8L11.8 0Z" fill="#F5A623" />
      </svg>
    )
  }
}
