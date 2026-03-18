import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ${
        scrolled ? "bg-background/60 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img src={logo} alt="ZeroFlow" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-heading text-xl font-extrabold tracking-tighter text-foreground">ZeroFlow</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors duration-300">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="btn-pill border-2 border-primary/20 text-foreground hover:border-primary/50 bg-transparent">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="btn-pill bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(167,139,250,0.4)]">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-lg p-6 flex flex-col gap-4 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-body font-medium text-foreground/70">{link.label}</a>
          ))}
          <button onClick={() => { setMobileOpen(false); navigate("/login"); }} className="btn-pill border-2 border-primary/20 text-foreground bg-transparent w-full">Login</button>
          <button onClick={() => { setMobileOpen(false); navigate("/signup"); }} className="btn-pill bg-primary text-primary-foreground w-full">Get Started</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
