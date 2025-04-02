"use server"

import { GoogleCustomSearch } from "@/lib/google-search"

export async function searchRecipes(ingredients: string) {
  try {
    const googleSearch = new GoogleCustomSearch()
    const results = await googleSearch.searchRecipes(ingredients)
    return results
  } catch (error) {
    console.error("Error searching recipes:", error)
    // エラーメッセージをクライアントに返す代わりに、空の配列を返す
    return []
  }
}

