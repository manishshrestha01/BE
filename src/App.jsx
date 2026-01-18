import AppRoutes from './Routes'
import { AuthProvider } from './context/AuthContext'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Analytics />
    </AuthProvider>
  )
}

export default App
