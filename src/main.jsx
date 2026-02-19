import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

// Suppress ResizeObserver loop error (common in responsive layouts)
// This error is benign and occurs when resize observations are delivered
// during a single animation frame
const resizeObserverErr = window.console.error;
window.console.error = (...args) => {
  if (
    args[0]?.includes?.("ResizeObserver") ||
    (typeof args[0] === "string" && args[0].includes("ResizeObserver"))
  ) {
    return;
  }
  resizeObserverErr(...args);
};

// React app routes
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
