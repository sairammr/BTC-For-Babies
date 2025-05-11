"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { TaskProvider } from "@/lib/task-store"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // For demo purposes, we'll just check if we're on the login page
    // In a real app, you'd want to check for a valid auth token/session
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [pathname, router])

  // Don't show navigation on login page
  const showNavigation = pathname !== "/login" && pathname !== "/parent"

  return (
    <html lang="en">
      <head>
        <title>Pixel Quest - Task & Reward App</title>
        <meta name="description" content="A fun task and reward app for kids" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 bg-[url('/images/pixel-pattern.png')] bg-repeat">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TaskProvider>
            {children}
            {showNavigation && <Navigation />}
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

