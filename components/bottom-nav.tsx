"use client"

import { Home, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center px-4 py-2 ${
          pathname === "/" ? "text-orange-500" : "text-gray-600"
        }`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">ホーム</span>
      </Link>

      <Link
        href="/menu"
        className={`flex flex-col items-center justify-center px-4 py-2 ${
          pathname === "/menu" ? "text-orange-500" : "text-gray-600"
        }`}
      >
        <Menu size={24} />
        <span className="text-xs mt-1">メニュー</span>
      </Link>
    </div>
  )
}
