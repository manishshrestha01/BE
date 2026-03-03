import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import AdSenseRouteRefresh from "./AdSenseRouteRefresh";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AdSenseRouteRefresh />
      <AppRoutes />
      <Analytics />
    </AuthProvider>
  );
}

export default App;
