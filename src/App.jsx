import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import AdSenseRouteRefresh from "./AdSenseRouteRefresh";

function App() {
  return (
    <AuthProvider>
      <AdSenseRouteRefresh />
      <AppRoutes />
      <Analytics />
    </AuthProvider>
  );
}

export default App;
