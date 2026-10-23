import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function NotFoundPage() {
  return <main className="page-container flex min-h-[65vh] flex-col items-center justify-center text-center"><p className="mb-5 text-sm font-bold tracking-widest text-primary">404 — ROUTE NOT FOUND</p><h1 className="display-serif text-6xl md:text-8xl">Lost your way?</h1><p className="mt-5 max-w-md text-muted-foreground">That page does not exist. Your next great drive is still just around the corner.</p><Button className="mt-8" asChild><Link to="/"><ArrowLeft size={17} /> Back to homepage</Link></Button></main>;
}