import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

import { FavoritesProvider } from "@/features/favorites/model/FavoritesProvider";
import { ThemeProvider } from "@/features/theme/model/ThemeProvider";
import { BookingPage } from "@/pages/booking/ui/BookingPage";
import { PickupPage } from "@/pages/pickup/ui/PickupPage";
import { ReviewPage } from "@/pages/review/ui/ReviewPage";
import { ConfirmationPage } from "@/pages/confirmation/ui/ConfirmationPage";
import { CarDetailsPage } from "@/pages/details/ui/CarDetailsPage";
import { FavoritesPage } from "@/pages/favorites/ui/FavoritesPage";
import { FleetPage } from "@/pages/fleet/ui/FleetPage";
import { HomePage } from "@/pages/home/ui/HomePage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { StaticPage } from "@/pages/static/ui/StaticPage";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppLayout() {
  return (
    <>
      <button
        type="button"
        onClick={() => document.getElementById("main-content")?.focus()}
        className="sr-only z-50 bg-card p-3 focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </button>
      <ScrollToTop />
      <SiteHeader />

      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/fleet/:id" element={<CarDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/checkout/:id" element={<BookingPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/about" element={<StaticPage kind="about" />} />
          <Route path="/contact" element={<StaticPage kind="contact" />} />
          <Route path="/privacy" element={<StaticPage kind="privacy" />} />
          <Route path="/terms" element={<StaticPage kind="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <SiteFooter />
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
