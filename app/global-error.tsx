"use client"

import { Box, Container, Typography, Button } from "@mui/material"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error(error)
  }, [error])

  return (
    <html lang="ja">
      <body>
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              エラーが発生しました
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              申し訳ありませんが、予期しないエラーが発生しました。
            </Typography>
            <Button onClick={() => reset()} variant="contained" color="primary" sx={{ mt: 2 }}>
              もう一度試す
            </Button>
          </Box>
        </Container>
      </body>
    </html>
  )
}

