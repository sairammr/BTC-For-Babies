"use client"

import { ThemeProvider } from "next-themes"
import { TaskProvider } from "@/context/task-context"
import { useEffect, useState } from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pixel Quest - Task & Reward App</title>
        <meta name="description" content="A fun task and reward app for kids" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TaskProvider>
            {mounted ? children : null}
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

