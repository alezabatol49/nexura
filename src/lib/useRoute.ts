import { useEffect, useState } from "react";

export function useRoute(): string {
  const [route, setRoute] = useState(() => getRoute());

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener("popstate", onChange);
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  return route;
}

function getRoute(): string {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("/admin")) return "/admin";
  return "/";
}

export function navigate(path: string): void {
  window.location.hash = path;
  window.scrollTo(0, 0);
}
