import { Box, Container, Typography, Button } from "@mui/material"
import Link from "next/link"

export default function NotFound() {
  return (
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
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          ページが見つかりません
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          お探しのページは存在しないか、移動された可能性があります。
        </Typography>
        <Button component={Link} href="/" variant="contained" color="primary" sx={{ mt: 2 }}>
          ホームに戻る
        </Button>
      </Box>
    </Container>
  )
}

