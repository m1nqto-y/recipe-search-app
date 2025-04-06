"use client"

import { useState, type KeyboardEvent } from "react"
import { X, Plus, Search } from "lucide-react"
import { searchRecipes } from "@/lib/actions"

interface Recipe {
  title: string
  link: string
  snippet: string
  image?: string
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showApiWarning, setShowApiWarning] = useState(false)

  const handleAddIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  const handleDeleteIngredient = (ingredientToDelete: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete))
  }

  const handleSearch = async () => {
    if (ingredients.length === 0) return

    setLoading(true)
    setError("")

    try {
      const searchQuery = ingredients.join(", ")
      const results = await searchRecipes(searchQuery)

      if (results.length === 0) {
        // 結果が空の場合は警告を表示
        setShowApiWarning(true)
      }

      setRecipes(results)
    } catch (err) {
      setError("検索中にエラーが発生しました。もう一度お試しください。")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseWarning = () => {
    setShowApiWarning(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">レシピ検索</h1>
        <p className="text-gray-600 mb-6">食材を入力して、レシピを見つけましょう</p>

        <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg mb-4 max-w-xl mx-auto bg-white">
          <span className="text-sm text-gray-500 mr-1">検索する食材:</span>

          {ingredients.map((ingredient) => (
            <div key={ingredient} className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm">
              {ingredient}
              <button
                onClick={() => handleDeleteIngredient(ingredient)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <div className="flex flex-1 min-w-[120px]">
            <input
              className="flex-1 outline-none text-sm"
              placeholder="食材を入力"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleAddIngredient}
              disabled={!inputValue.trim()}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              <Plus size={14} />
              <span className="ml-1">単語を追加</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || ingredients.length === 0}
          className="flex items-center justify-center mx-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? (
            <span>検索中...</span>
          ) : (
            <>
              <Search size={18} className="mr-1" />
              <span>レシピを検索</span>
            </>
          )}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {ingredients.length > 0 && recipes.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">「{ingredients.join("、")}」のレシピ検索結果</h2>
          <hr className="mb-6" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
          >
            <a href={recipe.link} target="_blank" rel="noopener noreferrer" className="block flex-1 flex flex-col">
              <div className="h-36 overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg?height=140&width=280"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 画像読み込みエラー時にプレースホルダー画像を表示
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=140&width=280"
                  }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold mb-2 line-clamp-2">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 flex-1">{recipe.snippet}</p>
                <div className="mt-2 text-xs text-right text-orange-500 hover:underline">レシピを見る →</div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {ingredients.length > 0 && recipes.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">レシピが見つかりませんでした。別の食材を試してみてください。</p>
        </div>
      )}

      {showApiWarning && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="py-1">
              <p>注意: Google API キーが設定されていないため、モックデータを表示しています。</p>
            </div>
            <button onClick={handleCloseWarning} className="ml-auto text-gray-700">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

