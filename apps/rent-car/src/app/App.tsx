import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { FavoritesProvider } from "@/features/favorites/model/FavoritesProvider";
import { ThemeProvider } from "@/features/theme/model/ThemeProvider";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { HomePage } from "@/pages/home/ui/HomePage";
import { FleetPage } from "@/pages/fleet/ui/FleetPage";
import { CarDetailsPage } from "@/pages/details/ui/CarDetailsPage";
import { FavoritesPage } from "@/pages/favorites/ui/FavoritesPage";
import { BookingPage } from "@/pages/booking/ui/BookingPage";
import { StaticPage } from "@/pages/static/ui/StaticPage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";

// HashRouter preserves deep links on GitHub Pages without a server-side SPA rewrite.
function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}
export function App() {
  return <ThemeProvider><FavoritesProvider><HashRouter>
    <a href="#main-content" className="sr-only z-50 bg-card p-3 focus:not-sr-only focus:absolute focus:left-4 focus:top-3">Skip to content</a>
    <ScrollManager />
    <SiteHeader />
    <div id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/fleet/:id" element={<CarDetailsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/about" element={<StaticPage kind="about" />} />
        <Route path="/contact" element={<StaticPage kind="contact" />} />
        <Route path="/privacy" element={<StaticPage kind="privacy" />} />
        <Route path="/terms" element={<StaticPage kind="terms" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    <SiteFooter />
  </HashRouter></FavoritesProvider></ThemeProvider>;
}