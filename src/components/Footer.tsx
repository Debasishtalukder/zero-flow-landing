import { Twitter, Github } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => (
  <footer className="bg-dark text-dark-foreground py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="ZeroFlow" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-heading text-lg font-extrabold tracking-tighter text-dark-foreground">ZeroFlow</span>
          </div>
          <p className="text-sm font-body text-dark-foreground/50">Your personal life OS.</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          {["Features", "Pricing", "Roadmap", "Privacy Policy", "Terms of Service"].map((l) => (
            <a key={l} href="#" className="text-sm font-body text-dark-foreground/50 hover:text-dark-foreground transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-dark-foreground/10 flex items-center justify-center hover:bg-dark-foreground/20 transition-colors">
            <Twitter size={18} className="text-dark-foreground/60" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-dark-foreground/10 flex items-center justify-center hover:bg-dark-foreground/20 transition-colors">
            <Github size={18} className="text-dark-foreground/60" />
          </a>
        </div>
      </div>

      <div className="border-t border-dark-foreground/10 pt-6">
        <p className="text-xs font-body text-success/70 text-center">
          © 2026 ZeroFlow. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
