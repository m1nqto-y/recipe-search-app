"use client"

import { useState, type KeyboardEvent } from "react"
import { Plus, Search, X } from "lucide-react"
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

  const handleSearch = async () => {
    if (inputValue.trim() || ingredients.length > 0) {
      // 入力中の値があれば追加してから検索
      if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
        setIngredients([...ingredients, inputValue.trim()])
        setInputValue("")
      }

      setLoading(true)
      setError("")

      try {
        const searchQuery = ingredients.length > 0 ? ingredients.join(", ") : inputValue.trim()
        const results = await searchRecipes(searchQuery)

        if (results.length === 0) {
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
  }

  const handleCloseWarning = () => {
    setShowApiWarning(false)
  }

  const handleDeleteIngredient = (ingredientToDelete: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete))
  }

  return (
    <div className="container mx-auto py-8 px-4 pb-20 flex flex-col h-screen">
      {recipes.length === 0 ? (
        <>
          <div className="flex-grow flex flex-col justify-center">
            <p className="text-2xl mb-auto mt-16 leading-relaxed">
              食材を入力して
              <br />
              おいしいレシピを見つけましょう
            </p>
          </div>

          <div className="mb-16">
            <div className="relative mb-4">
              <div className="border border-gray-300 rounded-lg flex flex-col p-2 bg-white">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">検索する食材:</span>
                  <input
                    className="flex-1 outline-none text-sm min-w-0"
                    placeholder="食材を入力"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  onClick={handleAddIngredient}
                  disabled={!inputValue.trim()}
                  className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 self-end"
                >
                  <Plus size={16} className="inline mr-1" />
                  <span>単語を追加</span>
                </button>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center">
                      {ingredient}
                      <button
                        onClick={() => handleDeleteIngredient(ingredient)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || (!inputValue.trim() && ingredients.length === 0)}
              className="w-full py-2 bg-orange-300 text-white rounded-md hover:bg-orange-400 disabled:opacity-50 flex items-center justify-center"
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
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex items-center">
            <button onClick={() => setRecipes([])} className="text-gray-600 hover:text-gray-900 mr-2">
              ← 戻る
            </button>
            <h2 className="text-lg font-medium">「{ingredients.join("、")}」のレシピ</h2>
          </div>

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
        </>
      )}

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {showApiWarning && (
        <div className="fixed bottom-20 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
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
