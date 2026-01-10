import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import Home from './components/Home'
import Login from './components/Login'
import PrivacyPolicy from './components/Landing/PrivacyPolicy'
import TermsOfService from './components/Landing/TermsOfService'
import UserInfo from './components/UserInfo'
import NotFound from './components/Landing/NotFound'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/user-info" element={<UserInfo />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes