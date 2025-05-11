"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-purple-800 px-4 py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-around">
        <NavItem href="/" icon="/images/gem.png" label="HOME" isActive={isActive("/")} />
        <NavItem href="/rewards" icon="/images/chest.png" label="REWARDS" isActive={isActive("/rewards")} />
        <NavItem href="/pet" icon="/images/pets.png" label="PET" isActive={isActive("/pet")} />
      </div>
    </nav>
  )
}

interface NavItemProps {
  href: string
  icon: string
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <div className="relative">
        <div className={`h-12 w-12 rounded-lg ${isActive ? "bg-purple-900" : "bg-purple-700"} p-2`}>
          <img src={icon || "/placeholder.svg"} alt={label} className="h-full w-full" />
        </div>
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-0 h-1 w-12 -translate-x-1/2 rounded-t-full bg-pink-400"
            layoutId="activeIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
      <span className={`font-arcade mt-1 text-xs ${isActive ? "text-pink-200" : "text-white"}`}>{label}</span>
    </Link>
  )
}
