import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { PortfolioImage } from "@/data/portfolioData";

interface LightboxProps {
  image: PortfolioImage;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-5xl max-h-[85vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-contain rounded-lg"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent rounded-b-lg">
          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
            {image.category}
          </p>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            {image.title}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
