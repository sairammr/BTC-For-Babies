import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { TaskProvider } from "@/lib/task-store"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            <Navigation />
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

