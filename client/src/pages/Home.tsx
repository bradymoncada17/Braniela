import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Catalog from "@/components/Catalog";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useRef } from "react";

export default function Home() {
  const catalogRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);

  const handleNavClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExplore = () => {
    handleNavClick("catalog");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNavClick={handleNavClick} />
      <main>
        <Hero onExplore={handleExplore} />
        <Categories />
        <Catalog />
        <Testimonials />
        <Footer />
      </main>
      <WhatsAppButton />
    </div>
  );
}
