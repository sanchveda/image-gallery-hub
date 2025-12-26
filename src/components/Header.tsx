import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="font-display text-xl font-semibold text-foreground">
          Portfolio
        </a>

        <nav className="hidden sm:flex items-center gap-8">
          <a 
            href="#gallery" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Gallery
          </a>
          <a 
            href="#about" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
