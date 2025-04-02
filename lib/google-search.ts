interface SearchResult {
  title: string
  link: string
  snippet: string
  image?: string
}

export class GoogleCustomSearch {
  private apiKey: string
  private searchEngineId: string

  constructor() {
    // 環境変数から Google Custom Search API のキーと検索エンジン ID を取得
    this.apiKey = process.env.GOOGLE_API_KEY || ""
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || ""

    // 開発環境用のモックデータを使用するかどうかをチェック
    if (!this.apiKey || !this.searchEngineId) {
      console.warn("Google API Key or Search Engine ID is missing. Using mock data instead.")
    }
  }

  async searchRecipes(ingredients: string): Promise<SearchResult[]> {
    // API キーまたは検索エンジン ID が設定されていない場合はモックデータを返す
    if (!this.apiKey || !this.searchEngineId) {
      return this.getMockRecipes(ingredients)
    }

    const query = `${ingredients} レシピ`
    // searchType=image パラメータを削除して通常の検索結果を取得
    const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Google API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.items || data.items.length === 0) {
        return []
      }

      // 検索結果から必要な情報を抽出
      return data.items.map((item: any) => {
        // サムネイル画像があれば使用、なければページ内の画像を探す
        let imageUrl = null
        if (item.pagemap?.cse_image?.[0]?.src) {
          imageUrl = item.pagemap.cse_image[0].src
        } else if (item.pagemap?.cse_thumbnail?.[0]?.src) {
          imageUrl = item.pagemap.cse_thumbnail[0].src
        } else if (item.pagemap?.metatags?.[0]?.["og:image"]) {
          imageUrl = item.pagemap.metatags[0]["og:image"]
        }

        return {
          title: item.title,
          link: item.link,
          snippet: item.snippet || "",
          image: imageUrl || "/placeholder.svg?height=140&width=280",
        }
      })
    } catch (error) {
      console.error("Error fetching from Google Custom Search API:", error)
      // エラーが発生した場合もモックデータを返す
      return this.getMockRecipes(ingredients)
    }
  }

  // モックレシピデータを生成する関数
  private getMockRecipes(ingredients: string): SearchResult[] {
    const ingredientList = ingredients.split(/,\s*/)

    // 基本的なモックレシピデータ
    const mockRecipes: SearchResult[] = [
      {
        title: `${ingredientList[0]}を使った簡単パスタ`,
        link: "https://example.com/recipe1",
        snippet: `${ingredientList.join("と")}を使った美味しいパスタのレシピです。20分で簡単に作れます。`,
        image: "https://source.unsplash.com/random/300x200/?pasta",
      },
      {
        title: `${ingredientList[0]}のヘルシーサラダ`,
        link: "https://example.com/recipe2",
        snippet: `${ingredientList.join("と")}を組み合わせた栄養満点のサラダです。ダイエット中の方にもおすすめ。`,
        image: "https://source.unsplash.com/random/300x200/?salad",
      },
      {
        title: `${ingredientList[0]}の煮込み料理`,
        link: "https://example.com/recipe3",
        snippet: `${ingredientList.join("と")}を使った体が温まる煮込み料理です。冬にぴったりの一品。`,
        image: "https://source.unsplash.com/random/300x200/?stew",
      },
      {
        title: `${ingredientList[0]}のスープ`,
        link: "https://example.com/recipe4",
        snippet: `${ingredientList.join("と")}で作る簡単スープのレシピです。風邪予防にもおすすめです。`,
        image: "https://source.unsplash.com/random/300x200/?soup",
      },
      {
        title: `${ingredientList[0]}を使ったデザート`,
        link: "https://example.com/recipe5",
        snippet: `${ingredientList.join("と")}を使った甘くて美味しいデザートのレシピです。お子様にも人気です。`,
        image: "https://source.unsplash.com/random/300x200/?dessert",
      },
      {
        title: `${ingredientList[0]}の炒め物`,
        link: "https://example.com/recipe6",
        snippet: `${ingredientList.join("と")}を使った簡単炒め物のレシピです。10分で完成する時短料理です。`,
        image: "https://source.unsplash.com/random/300x200/?stir-fry",
      },
    ]

    return mockRecipes
  }
}

