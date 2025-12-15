import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
  </Routes>
)

export default AppRoutes