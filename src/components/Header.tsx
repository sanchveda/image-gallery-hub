import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-background/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold text-foreground">
          Sanchayan
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          <Link 
            to="/#gallery" 
            className="text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            Gallery
          </Link>
          <Link 
            to="/albums" 
            className={`text-base transition-colors ${
              location.pathname.startsWith('/albums') 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Albums
          </Link>
          <a 
            href="#about" 
            className="text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
