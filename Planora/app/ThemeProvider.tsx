"use client";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      <button 
        onClick={toggleTheme} 
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
      >
        {theme === "dark" ? "☀️ LIGHT" : "🌙 DARK"}
      </button>
      {children}
    </>
  );
}