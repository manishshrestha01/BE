import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing/Landing'
import Home from './components/Home'
import Login from './components/Login'
import PrivacyPolicy from './components/Landing/PrivacyPolicy'
import TermsOfService from './components/Landing/TermsOfService'
import FAQ from './components/Landing/FAQ'
import UserInfo from './components/UserInfo'
import NotFound from './components/Landing/NotFound'
import DashboardManual from './components/DashboardManual/DashboardManual'
import Colleges from './components/Colleges'
import College from './components/College'
import OfficeViewer from './components/QuickLook/OfficeViewer'
import BlogHome from './components/Blog/BlogHome'
import BlogSemester from './components/Blog/BlogSemester'
import BlogSubject from './components/Blog/BlogSubject'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<DashboardManual />} />
    <Route path="/office-viewer" element={<OfficeViewer />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/user-info" element={<UserInfo />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/colleges" element={<Colleges />} />
    <Route path="/college/:slug" element={<College />} />
    <Route path="/blog" element={<BlogHome />} />
    <Route path="/blog/semester/:semesterId" element={<BlogSemester />} />
    <Route path="/blog/semester/:semesterId/:subjectSlug" element={<BlogSubject />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes
