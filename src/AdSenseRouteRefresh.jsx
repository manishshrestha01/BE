import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AdSenseRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {}
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
