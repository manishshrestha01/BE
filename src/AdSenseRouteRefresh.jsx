import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AdSenseRouteRefresh() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (e) {}
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
