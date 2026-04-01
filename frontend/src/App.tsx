import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './shared/components/app-shell'
import { ProtectedRoute } from './shared/components/protected-route'
import { AuthPage } from './features/auth/pages/auth-page'
import { CreatePostPage } from './features/posts/pages/create-post-page'
import { FeedPage } from './features/posts/pages/feed-page'
import { PostDetailsPage } from './features/posts/pages/post-details-page'

function App() {
  return (
    <div className="relative">
      <div className="grain" aria-hidden />
      <AppShell>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/post/:slug" element={<PostDetailsPage />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </div>
  )
}

export default App
