"use client"

import { Search, MenuIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 flex justify-around py-3">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center px-4 ${
          pathname === "/" ? "text-orange-500" : "text-gray-600"
        }`}
      >
        <Search size={20} />
        <span className="text-xs mt-1">Search</span>
      </Link>

      <Link
        href="/menu"
        className={`flex flex-col items-center justify-center px-4 ${
          pathname === "/menu" ? "text-orange-500" : "text-gray-600"
        }`}
      >
        <MenuIcon size={20} />
        <span className="text-xs mt-1">Menu</span>
      </Link>
    </div>
  )
}
