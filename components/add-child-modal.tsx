"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Sparkles } from "lucide-react"
import supabase  from "../tools/supabaseConfig"
import GetAccountDetails from "@/hooks/getAccountdetails"
import { ethers } from 'ethers'

interface AddChildModalProps {
  onClose: () => void
  onAddChild: (child: any) => void
}

export default function AddChildModal({ onClose, onAddChild }: AddChildModalProps) {
  const [childName, setChildName] = useState("")
  const [age, setAge] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create new child object
    const newChild = {
      name: childName,
      age: Number.parseInt(age),
      parent_wallet: GetAccountDetails(),
      child_wallet: await createWallet(),
      password: password
    }

    const {data,error} = await supabase.from("children").insert(newChild)

    // Add the child
    onAddChild(newChild)

    // Close the modal
    onClose()
  }

  async function createWallet() {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    
    // If password is provided, encrypt the wallet
    if (password) {
      const encryptedWallet = await wallet.encrypt(password);
      // You might want to store this encrypted wallet somewhere secure
      return wallet.address;
    }
    
    return wallet.address;
  }

  // Generate a random Bitcoin wallet address for demo purposes
  const generateRandomWalletAddress = () => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let result = "bc1"
    for (let i = 0; i < 30; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border-[#F8C6D2] shadow-lg">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[#4B5563] font-bold flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#F8C6D2]" />
            Add New Child
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="childName" className="text-[#4B5563] flex items-center">
                Child's Name
                <span className="text-[#F8C6D2] ml-1">*</span>
              </Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="border-[#F8C6D2] focus:ring-[#F8C6D2] shadow-sm"
                required
                placeholder="e.g., Emma"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age" className="text-[#4B5563] flex items-center">
                Age
                <span className="text-[#F8C6D2] ml-1">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="17"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-[#F8C6D2] focus:ring-[#F8C6D2] shadow-sm"
                required
                placeholder="e.g., 10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-[#4B5563]">
                Password for child's wallet
              </Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#F8C6D2] focus:ring-[#F8C6D2] font-mono text-sm shadow-sm"
                placeholder="password"
              />
              <p className="text-xs text-[#6B7280]">Leave blank to auto-generate a new wallet</p>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#E5E7EB] text-[#4B5563] hover:bg-[#F5F5F5]"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#F8C6D2] hover:bg-[#F8C6D2]/80 text-[#4B5563] shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
