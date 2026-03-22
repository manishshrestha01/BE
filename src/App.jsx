import { useEffect } from "react";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import AdSenseRouteRefresh from "./AdSenseRouteRefresh";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    const blockPrintShortcut = (event) => {
      const key = event.key?.toLowerCase?.();
      if ((event.ctrlKey || event.metaKey) && key === "p") {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("keydown", blockPrintShortcut, true);
    document.addEventListener("keydown", blockPrintShortcut, true);

    return () => {
      window.removeEventListener("keydown", blockPrintShortcut, true);
      document.removeEventListener("keydown", blockPrintShortcut, true);
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
