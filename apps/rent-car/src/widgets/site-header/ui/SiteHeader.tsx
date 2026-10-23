import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, CarFront, Heart, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useFavorites } from "@/features/favorites/model/FavoritesProvider";
import { useTheme } from "@/features/theme/model/ThemeProvider";

const links = [
  { path: "/", name: "Home" },
  { path: "/fleet", name: "Our fleet" },
  { path: "/favorites", name: "Saved cars" },
  { path: "/about", name: "About" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const { dark, toggleTheme } = useTheme();
  return (
    <header className="relative z-40 border-b border-border bg-background/95">
      <div className="page-container flex h-[84px] items-center justify-between gap-5">
        <Link to="/" aria-label="Aventra homepage" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><CarFront size={22} strokeWidth={2} /></span>
          <span className="text-xl font-extrabold tracking-[-.06em]">AVENTRA<span className="text-primary">.</span></span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((link) => <NavLink key={link.path} end={link.path === "/"} to={link.path} className={({ isActive }) => "text-sm font-medium transition-colors hover:text-primary " + (isActive ? "text-primary" : "text-muted-foreground")}>{link.name}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</Button>
          <Button variant="ghost" size="icon" asChild><Link to="/favorites" aria-label={"Saved cars, " + favorites.length}><Heart size={19} fill={favorites.length ? "currentColor" : "none"} /></Link></Button>
          <Button className="hidden sm:inline-flex" asChild><Link to="/fleet">Explore cars <ArrowUpRight size={17} /></Link></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-controls="mobile-nav" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</Button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-nav" aria-label="Mobile navigation" className="absolute left-0 right-0 top-full border-y border-border bg-card px-6 py-5 shadow-xl lg:hidden">
        {links.map((link) => <NavLink key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-muted">{link.name}</NavLink>)}
        <Link to="/contact" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-xl px-4 py-3 text-base font-medium hover:bg-muted">Contact</Link>
      </nav>}
    </header>
  );
}