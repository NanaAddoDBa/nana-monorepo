import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, CarFront, Heart, Menu, Moon, Sun, X } from "lucide-react";

import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { useTheme } from "@/features/theme/model/ThemeProvider";
import { site } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/fleet", label: "Our fleet" },
  { to: "/favorites", label: "Saved cars" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="relative z-40 border-b border-border bg-background/95">
      <div className="page-container flex h-[84px] items-center justify-between gap-5">
        <Link
          to="/"
          aria-label={site.name + " homepage"}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CarFront size={22} strokeWidth={2} />
          </span>
          <span className="text-xl font-extrabold tracking-[-.06em]">
            {site.name.toUpperCase()}<span className="text-primary">.</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              end={to === "/"}
              to={to}
              className={({ isActive }) =>
                "text-sm font-medium transition-colors hover:text-primary " +
                (isActive ? "text-primary" : "text-muted-foreground")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link
              to="/favorites"
              aria-label={"Saved cars, " + favorites.length}
            >
              <Heart
                size={19}
                fill={favorites.length > 0 ? "currentColor" : "none"}
              />
            </Link>
          </Button>

          <Button className="hidden sm:inline-flex" asChild>
            <Link to="/fleet">
              Explore cars <ArrowUpRight size={17} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full border-y border-border bg-card px-6 py-5 shadow-xl lg:hidden"
        >
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-muted"
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
