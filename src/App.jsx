import { useLocation } from 'react-router-dom'
import AppRoutes from './Routes'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'

function App() {
  const location = useLocation()
  // Hide navbar on landing, login, and dashboard pages
  const hideNavbar = ['/home', '/', '/dashboard', '/login'].includes(location.pathname)

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
 