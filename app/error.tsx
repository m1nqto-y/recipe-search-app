"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
      <p className="mb-6 text-gray-600">申し訳ありませんが、予期しないエラーが発生しました。</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        もう一度試す
      </button>
    </div>
  )
}

