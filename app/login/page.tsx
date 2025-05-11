"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import PixelatedContainer from "@/components/pixelated-container"
import PageTitle from "@/components/page-title"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, we'll just set a flag in localStorage
    // In a real app, you'd want to implement proper authentication
    localStorage.setItem("isAuthenticated", "true")
    router.push("/")
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <PixelatedContainer className="w-full max-w-md bg-white/80 backdrop-blur-sm">
        <div className="p-6">
          <PageTitle title="LOGIN" icon="/images/pixel-avatar.png" />
          
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="mb-2 block font-arcade text-purple-800">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border-2 border-purple-200 bg-white p-3 font-arcade text-purple-800 placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block font-arcade text-purple-800">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-purple-200 bg-white p-3 font-arcade text-purple-800 placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="mt-6 w-full bg-purple-500 font-arcade text-white hover:bg-purple-600"
            >
              START QUEST
            </Button>
          </form>
        </div>
      </PixelatedContainer>
    </div>
  )
} 