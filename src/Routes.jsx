import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import PrivacyPolicy from './components/Landing/PrivacyPolicy'
import TermsOfService from './components/Landing/TermsOfService'
import UserInfo from './components/UserInfo'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/user-info" element={<UserInfo />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
  </Routes>
)

export default AppRoutes