"use client"

import { useState, type KeyboardEvent } from "react"
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  InputBase,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material"
import { PlusIcon, SearchIcon } from "lucide-react"
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          レシピ検索
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          食材を入力して、おいしいレシピを見つけましょう
        </Typography>

        <Paper
          component="div"
          sx={{
            p: "8px 16px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            maxWidth: 600,
            mx: "auto",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            検索する食材:
          </Typography>

          {ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              onDelete={() => handleDeleteIngredient(ingredient)}
              size="small"
              sx={{ borderRadius: "16px" }}
            />
          ))}

          <Box sx={{ display: "flex", flex: "1 1 auto", minWidth: "120px" }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="食材を入力"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <IconButton size="small" onClick={handleAddIngredient} disabled={!inputValue.trim()} sx={{ p: "5px" }}>
              <PlusIcon size={16} />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                単語を追加
              </Typography>
            </IconButton>
          </Box>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading || ingredients.length === 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon size={20} />}
          sx={{ mt: 2 }}
        >
          {loading ? "検索中..." : "レシピを検索"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      {ingredients.length > 0 && recipes.length > 0 && (
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            「{ingredients.join("、")}」のレシピ検索結果
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
      )}

      <Grid container spacing={3}>
        {recipes.map((recipe, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardActionArea component="a" href={recipe.link} target="_blank" rel="noopener noreferrer">
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image || "/placeholder.svg?height=140&width=280"}
                  alt={recipe.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.snippet}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {ingredients.length > 0 && recipes.length === 0 && !loading && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            レシピが見つかりませんでした。別の食材を試してみてください。
          </Typography>
        </Box>
      )}

      <Snackbar open={showApiWarning} autoHideDuration={6000} onClose={handleCloseWarning}>
        <Alert onClose={handleCloseWarning} severity="warning" sx={{ width: "100%" }}>
          注意: Google API キーが設定されていないため、モックデータを表示しています。
        </Alert>
      </Snackbar>
    </Container>
  )
}

