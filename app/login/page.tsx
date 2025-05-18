"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "@/tools/supabaseConfig"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Check credentials in the database
      const { data, error } = await supabase
        .from('children')
        .select('child_name')
        .eq('child_name', username)
        .eq('password', password)
        .single()

      if (error) {
        console.error('Database error:', error)
        setError("Failed to login. Please try again.")
        return
      }

      if (!data) {
        setError("Invalid username or password")
        return
      }

      // Store username in localStorage for persistence
      localStorage.setItem('username', data.child_name)
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError("Failed to login. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#4B5563]">Welcome Back!</h1>
          <p className="mt-2 text-[#6B7280]">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-[#4B5563]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 border-[#C9E4FF] focus:ring-[#C9E4FF]"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#4B5563]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#C9E4FF] focus:ring-[#C9E4FF]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#C4E4D2] hover:bg-[#C4E4D2]/80 text-[#4B5563]"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
} 