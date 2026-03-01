import { useEffect } from "react";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import AdSenseRouteRefresh from "./AdSenseRouteRefresh";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      // Block browser/app shortcuts triggered with Ctrl/Cmd keys.
      if (event.ctrlKey || event.metaKey || event.key === "F12") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("copy", preventDefault, true);
    document.addEventListener("cut", preventDefault, true);
    document.addEventListener("paste", preventDefault, true);
    document.addEventListener("selectstart", preventDefault, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("copy", preventDefault, true);
      document.removeEventListener("cut", preventDefault, true);
      document.removeEventListener("paste", preventDefault, true);
      document.removeEventListener("selectstart", preventDefault, true);
    };
  }, []);

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
