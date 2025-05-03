"use client"

export default function MenuPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">メニュー</h1>
        <p className="text-gray-600 mb-6">アプリケーション情報</p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">バージョン情報</h2>

        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">アプリ名:</span>
            <span className="font-medium">レシピ検索アプリ</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">バージョン:</span>
            <span className="font-medium">1.0.0</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">最終更新日:</span>
            <span className="font-medium">{new Date().toLocaleDateString("ja-JP")}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">開発者:</span>
            <span className="font-medium">v0</span>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} レシピ検索アプリ All Rights Reserved.
        </div>
      </div>
    </div>
  )
}
